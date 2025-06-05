import {
	addressBech32SendADA,
	MESSAGE,
	PROTOCOLPARAMS,
	USDC_BASE_SEPOLIA_ADDRESS,
	USDC_DECIMALS,
} from "./constants";
import { Buffer } from "buffer";
import * as CardanoWasm from "@emurgo/cardano-serialization-lib-browser";
import nufiCoreSdk from "@nufi/dapp-client-core";

var UTXOs;

const formatCryptoAddress = (address) => {
	if (!address) {
		return "";
	}

	if (address.length > 8) {
		const firstPart = address.slice(0, 12);
		const lastPart = address.slice(-3);
		return `${firstPart}...${lastPart}`;
	} else {
		return address; // Return the address as is if it's too short
	}
};

const addEllipsis = (str, maxLength) => {
	if (str.length > maxLength) {
		return str.slice(0, maxLength - 3) + "...";
	}
	return str;
};

const fromBigNumberToUSDC = (number) => {
	if (number) {
		return number / USDC_DECIMALS;
	}

	return 0;
};

const toBigNumberFromUSDC = (number) => {
	if (number) {
		return number * USDC_DECIMALS;
	}

	return 0;
};

function formatDate(isoDate) {
	if (isoDate) {
		const date = new Date(isoDate);

		const day = String(date.getUTCDate()).padStart(2, "0");
		const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-indexed
		const year = date.getUTCFullYear();
		const hours = String(date.getUTCHours()).padStart(2, "0");
		const minutes = String(date.getUTCMinutes()).padStart(2, "0");

		return `${day}/${month}/${year}; ${hours}:${minutes}`;
	}
	return "";
}

const signMessage = async () => {
	if (!window.cardano || !window.cardano.nufiSSO) {
		throw new Error("NuFi Wallet not found");
	}

	try {
		// Enable NuFi Wallet
		const api = await window.cardano.nufiSSO.enable();
		// Get the user's Cardano address
		const addresses = await api.getUsedAddresses();
		const address = addresses[0];

		if (address) {
			// Sign a message with the user's address
			const addressBytes = Buffer.from(addresses?.[0], "hex");
			const formattedAddress =
				CardanoWasm.Address.from_bytes(addressBytes).to_bech32();
			const signature = await api.signData(
				address,
				Buffer.from(MESSAGE, "utf8").toString("hex")
			);
			if (signature) {
				return {
					formattedAddress,
					publicKeyHex: address,
					signatureHex: signature?.signature,
				};
			} else {
				throw new Error("Failed to sign message");
			}
		}
	} catch (error) {
		console.error("Error signing message:", error);
		throw error;
	} finally {
		const widgetApi = await nufiCoreSdk.getWidgetApi();
		if (widgetApi) {
			widgetApi.showWidget("closed");
		}
	}
};

const getNuFiAdaBalance = async () => {
	if (!window.cardano || !window.cardano.nufiSSO) {
		console.error("NuFi Wallet is not installed or unavailable.");
		return null;
	}

	try {
		// Enable NuFi Wallet
		const walletAPI = await window.cardano.nufiSSO.enable();

		// Fetch UTXOs (Unspent Transaction Outputs)
		const utxos = await walletAPI.getUtxos();

		if (!utxos.length) {
			console.warn("No UTXOs found. ADA balance is 0.");
			return 0;
		}

		// Convert UTXO hex to usable format
		let totalLovelace = BigInt(0);
		for (const utxoHex of utxos) {
			const utxoBytes = Buffer.from(utxoHex, "hex");
			const utxo =
				CardanoWasm.TransactionUnspentOutput.from_bytes(utxoBytes);
			totalLovelace += BigInt(utxo.output().amount().coin().to_str()); // Convert Lovelace to ADA
		}

		// Convert Lovelace (1 ADA = 1,000,000 Lovelace)
		const totalAda = Number(totalLovelace) / 1_000_000;
		return totalAda;
	} catch (error) {
		console.error("Error fetching NuFi ADA balance:", error);
		return null;
	}
};

const initTransactionBuilder = async () => {
	const txBuilder = CardanoWasm.TransactionBuilder.new(
		CardanoWasm.TransactionBuilderConfigBuilder.new()
			.fee_algo(
				CardanoWasm.LinearFee.new(
					CardanoWasm.BigNum.from_str(
						PROTOCOLPARAMS.linearFee.minFeeA
					),
					CardanoWasm.BigNum.from_str(
						PROTOCOLPARAMS.linearFee.minFeeB
					)
				)
			)
			.pool_deposit(
				CardanoWasm.BigNum.from_str(PROTOCOLPARAMS.poolDeposit)
			)
			.key_deposit(CardanoWasm.BigNum.from_str(PROTOCOLPARAMS.keyDeposit))
			.coins_per_utxo_byte(
				CardanoWasm.BigNum.from_str(PROTOCOLPARAMS.coinsPerUtxoWord)
			)
			.max_value_size(PROTOCOLPARAMS.maxValSize)
			.max_tx_size(PROTOCOLPARAMS.maxTxSize)
			.prefer_pure_change(true)
			.build()
	);

	return txBuilder;
};

const getUtxos = async () => {
	let Utxos = [];

	try {
		const wallet = await window.cardano.nufiSSO.enable();
		const rawUtxos = await wallet.getUtxos();

		for (const rawUtxo of rawUtxos) {
			const utxo = CardanoWasm.TransactionUnspentOutput.from_bytes(
				Buffer.from(rawUtxo, "hex")
			);
			const input = utxo.input();
			const txid = Buffer.from(
				input.transaction_id().to_bytes()
			).toString("hex");
			const txindx = input.index();
			const output = utxo.output();
			const amount = output.amount().coin().to_str(); // ADA amount in lovelace
			const multiasset = output.amount().multiasset();
			let multiAssetStr = "";

			if (multiasset) {
				const keys = multiasset.keys(); // policy Ids of the multiasset
				const N = keys.len();

				for (let i = 0; i < N; i++) {
					const policyId = keys.get(i);
					const policyIdHex = Buffer.from(
						policyId.to_bytes()
					).toString("hex");
					const assets = multiasset.get(policyId);
					const assetNames = assets.keys();
					const K = assetNames.len();

					for (let j = 0; j < K; j++) {
						const assetName = assetNames.get(j);
						const assetNameString = Buffer.from(
							assetName.name()
						).toString();
						const assetNameHex = Buffer.from(
							assetName.name()
						).toString("hex");
						const multiassetAmt = multiasset.get_asset(
							policyId,
							assetName
						);
						multiAssetStr += `+ ${multiassetAmt.to_str()} + ${policyIdHex}.${assetNameHex} (${assetNameString})`;
					}
				}
			}

			const obj = {
				txid: txid,
				txindx: txindx,
				amount: amount,
				str: `${txid} #${txindx} = ${amount}`,
				multiAssetStr: multiAssetStr,
				TransactionUnspentOutput: utxo,
			};
			Utxos.push(obj);
		}

		UTXOs = Utxos;
	} catch (err) {
		console.log("Error fetching UTXOs:", err);
	}
};

const getTxUnspentOutputs = async () => {
	let txOutputs = CardanoWasm.TransactionUnspentOutputs.new();
	for (const utxo of UTXOs) {
		txOutputs.add(utxo.TransactionUnspentOutput);
	}
	return txOutputs;
};

const buildTransaction = async (amount) => {
	const wallet = await window.cardano.nufiSSO.enable();
	const txBuilder = await initTransactionBuilder();
	const raw = await wallet.getChangeAddress();
	const changeAddress = CardanoWasm.Address.from_bytes(
		Buffer.from(raw, "hex")
	).to_bech32();
	const shelleyOutputAddress =
		CardanoWasm.Address.from_bech32(addressBech32SendADA);
	const shelleyChangeAddress = CardanoWasm.Address.from_bech32(changeAddress);

	txBuilder.add_output(
		CardanoWasm.TransactionOutput.new(
			shelleyOutputAddress,
			CardanoWasm.Value.new(
				CardanoWasm.BigNum.from_str(
					Number(amount * 1_000_000).toString()
				)
			)
		)
	);

	// Find the available UTXOs in the wallet and
	// us them as Inputs
	const txUnspentOutputs = await getTxUnspentOutputs();
	txBuilder.add_inputs_from(txUnspentOutputs, 1);

	// calculate the min fee required and send any change to an address
	txBuilder.add_change_if_needed(shelleyChangeAddress);

	// once the transaction is ready, we build it to get the tx body without witnesses
	const txBody = txBuilder.build();

	// Tx witness
	const transactionWitnessSet = CardanoWasm.TransactionWitnessSet.new();

	const tx = CardanoWasm.Transaction.new(
		txBody,
		CardanoWasm.TransactionWitnessSet.from_bytes(
			transactionWitnessSet.to_bytes()
		)
	);

	let txVkeyWitnesses = await wallet.signTx(
		Buffer.from(tx.to_bytes(), "utf8").toString("hex"),
		true
	);

	txVkeyWitnesses = CardanoWasm.TransactionWitnessSet.from_bytes(
		Buffer.from(txVkeyWitnesses, "hex")
	);

	transactionWitnessSet.set_vkeys(txVkeyWitnesses.vkeys());

	const signedTx = CardanoWasm.Transaction.new(
		tx.body(),
		transactionWitnessSet
	);

	return signedTx;
};

const signTransaction = async (amount) => {
	await getUtxos();
	const transaction = await buildTransaction(amount);
	const transactionHex = transaction.to_hex();
	return transactionHex;
};

const disconnectWallet = async () => {
	const widgetApi = await nufiCoreSdk.getWidgetApi();
	if (widgetApi) {
		widgetApi.signOut();
	}
};

export {
	formatCryptoAddress,
	addEllipsis,
	USDC_BASE_SEPOLIA_ADDRESS,
	fromBigNumberToUSDC,
	toBigNumberFromUSDC,
	formatDate,
	signMessage,
	getNuFiAdaBalance,
	signTransaction,
	disconnectWallet,
};
