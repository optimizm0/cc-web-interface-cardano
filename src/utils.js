import { Magic } from "magic-sdk";
import {
	CHAIN_CRIB_ADDRESS,
	NETWORK_ID,
	USDC_BASE_SEPOLIA_ADDRESS,
	USDC_DECIMALS,
} from "./constants";
import { USDC_BASE_SEPOLIA_ABI } from "./usdc-abi";
import { ethers } from "ethers";

// Setting network to point to Base testnet
const magicInstance = new Magic("pk_live_4A67BA442565C356", {
	network: {
		rpcUrl: "https://sepolia.base.org",
		chainId: 84532,
	},
});

const loginWithMagic = async (emailAddress, showUI) => {
	try {
		const did = await magicInstance.auth.loginWithEmailOTP({
			email: emailAddress,
			showUI: showUI,
		});
		return `${did}`;
	} catch (error) {
		console.error(error);
		// Handle errors if required!
	}
};

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

const getUSDCSignPayload = async ({ deadline, price, nonce, wallet }) => {
	const value = price;

	return {
		domain: {
			chainId: NETWORK_ID,
			name: "USDC",
			verifyingContract: USDC_BASE_SEPOLIA_ADDRESS,
			version: "2",
		},
		message: {
			contents: `Please sign this message to pay ${price} USDC for your new crib!`,
			owner: wallet,
			spender: CHAIN_CRIB_ADDRESS,
			value,
			nonce,
			deadline,
		},
		primaryType: "Permit",
		types: {
			EIP712Domain: [
				{ name: "name", type: "string" },
				{ name: "version", type: "string" },
				{ name: "chainId", type: "uint256" },
				{ name: "verifyingContract", type: "address" },
			],
			Permit: [
				{ name: "owner", type: "address" },
				{ name: "spender", type: "address" },
				{ name: "value", type: "uint256" },
				{ name: "nonce", type: "uint256" },
				{ name: "deadline", type: "uint256" },
			],
		},
	};
};

export async function getUSDCPermitSignatureAndDeadline({ price }) {
	const provider = new ethers.BrowserProvider(magicInstance.rpcProvider);

	const USDC_Contract = new ethers.Contract(
		USDC_BASE_SEPOLIA_ADDRESS,
		USDC_BASE_SEPOLIA_ABI,
		provider
	);

	const signer = await provider.getSigner();
	const wallet = await signer.getAddress();

	const nonce = Number(await USDC_Contract.nonces(wallet));
	const deadline = Math.floor(Date.now() / 1000) + 3600;

	const signedPayload = await getUSDCSignPayload({
		deadline,
		price,
		nonce,
		wallet,
	});

	// Request the signature via Magic's rpcProvider to ensure the Magic UI pops up
	const signature = await magicInstance.rpcProvider.request({
		method: "eth_signTypedData_v4",
		params: [wallet, signedPayload],
	});

	return { signature, deadline };
}

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

export {
	magicInstance,
	loginWithMagic,
	formatCryptoAddress,
	addEllipsis,
	USDC_BASE_SEPOLIA_ADDRESS,
	fromBigNumberToUSDC,
	toBigNumberFromUSDC,
	formatDate,
};
