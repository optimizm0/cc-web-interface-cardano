import { useState } from "react";
import styles from "./style.module.css";
import { Button, Input, Sidebar } from "../../components";
import { CameraIcon } from "../../assets";
import {
	useGetUserQuery,
	useUpdateUserMutation,
	useUploadImageMutation,
} from "src/redux/slices";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export const Profile = () => {
	const address = useSelector((state) => state?.user?.value?.user?.wallet);
	const [image, setImage] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
	});
	const { data, isLoading } = useGetUserQuery("", { refetchOnFocus: true });
	const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserMutation();
	const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	function copyToClipboard() {
		navigator.clipboard
			.writeText(address)
			.then(() => {
				toast.success("Wallet address copied!");
			})
			.catch(() => {
				toast.error("Something went wrong!");
			});
	}

	const handleImageUpload = async (e) => {
		e.preventDefault();
		if (image) {
			try {
				const imageFormData = new FormData();
				imageFormData.append("file", image);
				const result = await uploadImage(imageFormData);
				if (result?.data?.success) {
					updateUser({ imageUrl: result?.data?.data?.url })
						.then((result) => {
							if (result?.data?.success) {
								toast.success("Image uploaded successfully!");
							} else {
								toast.error("Image upload failed!");
							}
						})
						.catch(() => {
							toast.error("Image upload failed!");
						});
				} else {
					toast.error("Image upload failed!");
				}
			} catch {
				toast.error("Image upload failed!");
			}
		} else {
			toast.error("You need to select image to continue");
		}
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const fileSizeInMB = file.size / (1024 * 1024); // Convert bytes to MB
			if (fileSizeInMB > 1) {
				toast.error("Select an image less than 1MB");
			} else {
				setImage(file);
				const reader = new FileReader();
				reader.onloadend = () => {
					setImagePreview(reader.result);
				};
				reader.readAsDataURL(file);
			}
		}
	};

	const handleFormSubmission = (e) => {
		e.preventDefault();
		if (
			formData?.firstName?.length <= 2 ||
			formData?.lastName?.length <= 2
		) {
			toast.error(
				"First Name and Last Name's character length must be greater than two!"
			);
			return;
		}
		updateUser(formData)
			.then((result) => {
				if (result?.data?.success) {
					toast.success("Details changed successfully!");
				} else {
					toast.error("Update failed!");
				}
			})
			.catch(() => {
				toast.error("Update failed!");
			});
	};

	useEffect(() => {
		setFormData({
			firstName: data?.data?.firstName,
			lastName: data?.data?.lastName,
		});
	}, [data]);

	return (
		<main className={styles.main}>
			<div className={styles.pageContainer}>
				<div>
					<header className={styles.pageHeader}>
						<h6>PROFILE</h6>
					</header>
					<section className={styles.profile}>
						<div>
							<h1 className={styles.headerText}>User Details</h1>
						</div>
						<div className={styles.profileContents}>
							<form
								className={styles.profileImageUploader}
								onSubmit={handleImageUpload}
							>
								<div className={styles.imageHolder}>
									<CameraIcon className={styles.cameraIcon} />
									<input
										className={styles.fileInput}
										type="file"
										accept="image/png, image/jpeg, image/jpg, image/webp"
										onChange={handleImageChange}
									/>
									{imagePreview || data?.data?.imageUrl ? (
										<img
											alt="profile-imagePreview"
											src={
												imagePreview ||
												data?.data?.imageUrl
											}
										/>
									) : (
										""
									)}
								</div>
								<div
									className={
										styles.profileImageUploaderTextHolder
									}
								>
									<h3 className={styles.profilePictureHeader}>
										Profile Picture
									</h3>
									<p
										className={
											styles.profilePictureParagraph
										}
									>
										Image should not exceed 1MB!
									</p>
									<Button
										type="submit"
										disabled={isUpdatingUser || isUploading}
									>
										Upload Picture
									</Button>
								</div>
							</form>
							<div className={styles.userDetails}>
								<div className={styles.personalDetails}>
									<h2 className={styles.subHeaderText}>
										Personal details
									</h2>
									<form
										className={styles.userDetailsForm}
										onSubmit={handleFormSubmission}
									>
										<Input
											placeholder="First name"
											value={formData?.firstName || ""}
											name="firstName"
											onChange={handleChange}
											required
										/>
										<Input
											placeholder="Last name"
											value={formData?.lastName || ""}
											name="lastName"
											onChange={handleChange}
											required
										/>
										<Input
											placeholder="Email"
											disabled
											value={data?.data?.email || ""}
										/>
										<div
											className={
												styles.saveDetailsButtonContainer
											}
										>
											<Button
												type="submit"
												disabled={isUpdatingUser}
											>
												{isUpdatingUser
													? "Loading..."
													: "Save Details"}
											</Button>
										</div>
									</form>
									<div className={styles.stakeKeyContainer}>
										<h2 className={styles.subHeaderText}>
											Wallet Address
										</h2>
										<div className="">
											<Input
												value={address || ""}
												disabled
											/>
											<Button
												onClick={copyToClipboard}
												disabled={isLoading}
											>
												Copy address
											</Button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>
				</div>
				<Sidebar />
			</div>
		</main>
	);
};
