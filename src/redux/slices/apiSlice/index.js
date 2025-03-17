import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_BASE_URL } from "src/constants";

export const chainCribApi = createApi({
	reducerPath: "chainCribApi",
	baseQuery: fetchBaseQuery({
		baseUrl: BACKEND_BASE_URL,
		prepareHeaders: (headers, { getState }) => {
			const token = getState()?.user?.value?.jwt;
			if (token) {
				headers.set("cc-auth-tk", token);
			}
			return headers;
		},
	}),
	tagTypes: ["Cribs", "User"],
	endpoints: (build) => ({
		signIn: build.mutation({
			query: ({ body }) => ({
				url: "/signIn",
				method: "POST",
				body,
			}),
		}),
		loginOnServer: build.mutation({
			query: (header) => ({
				url: "/auth/login",
				method: "POST",
				headers: {
					["cc-magic-did"]: header,
				},
			}),
		}),
		loginOnServerWithNufi: build.mutation({
			query: (body) => ({
				url: "/auth/nufi",
				method: "POST",
				body,
			}),
		}),
		getUser: build.query({
			query: () => ({
				url: "/cardano/user/me",
				method: "GET",
			}),
			providesTags: ["User"],
		}),
		updateUser: build.mutation({
			query: (body) => ({
				url: "/users/me",
				method: "PATCH",
				body,
			}),
		}),
		getUserCribs: build.query({
			query: ({ page = 1, limit = 12 }) => ({
				url: `/property/user?limit=${limit}&page=${page}&sort=desc`,
				method: "GET",
			}),
			transformResponse: (response) => {
				return {
					message: "Successfully Fetched Cribs",
					success: true,
					data: response?.properties,
					meta: {
						total: response?.total,
						limit: Number(response?.limit),
						page: Number(response?.page),
					},
				};
			},
			providesTags: ["Cribs"],
		}),
		getCribs: build.query({
			query: (page = 1) => ({
				url: `/property?limit=12&page=${page}&sort=desc`,
				method: "GET",
			}),
			transformResponse: (response) => {
				return {
					message: "Successfully Fetched Cribs",
					success: true,
					data: response?.properties,
					meta: {
						total: response?.total,
						limit: Number(response?.limit),
						page: Number(response?.page),
					},
				};
			},
		}),
		sendLoginEmail: build.mutation({
			query: (body) => ({
				url: "/auth/send-login-email",
				method: "POST",
				body,
			}),
		}),
		cribPurchase: build.mutation({
			query: (body) => ({
				url: `/property/buy`,
				method: "POST",
				body,
			}),
			invalidatesTags: ["Cribs", "User"],
		}),
		getTransactions: build.query({
			query: (page = 1) => ({
				url: `/cardano/transactions/user?limit=12&page=${page}&sort=desc`,
				method: "GET",
			}),
		}),
		getNonce: build.query({
			query: () => ({
				url: "/users/nonce",
				method: "GET",
			}),
		}),
		uploadImage: build.mutation({
			query: (body) => ({
				url: "/media",
				method: "POST",
				body,
			}),
		}),
	}),
});

export const {
	useSignInMutation,
	useGetUserQuery,
	useGetCribsQuery,
	useSendLoginEmailMutation,
	useCribPurchaseMutation,
	useLoginOnServerMutation,
	useLoginOnServerWithNufiMutation,
	useGetNonceQuery,
	useUpdateUserMutation,
	useUploadImageMutation,
	useGetUserCribsQuery,
	useGetTransactionsQuery,
} = chainCribApi;
