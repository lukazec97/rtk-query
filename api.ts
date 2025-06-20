// src/redux/api.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { AxiosInstance } from '../config/api';
import { updateSummary } from './summaryReducer';
import { getArchitectureFilesFromS3 } from '../services/s3';
import { getArchitectureFilesByProjectId } from '../utils/common';

interface AxiosInterface {
  url: string;
  method: string;
  data?: any;
  params?: any;
}

const axiosBaseQuery = () => async ({ url, method, data, params }:AxiosInterface) => {
  try {
    const result = await AxiosInstance({
      url,
      method,
      data,
      params,
    });
    return { data: result.data };
  } catch (axiosError) {
    const err = axiosError;
    return {
      error: {
        status: err.response?.status,
        data: err.response?.data || err.message,
      },
    };
  }
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery(),
  tagTypes: [
    'Customer', 
    'Project', 
    'CustomerHistory',
    'ProjectHistory',
    'User',
    'Portfolio',
    'ImpactModel'
  ],
  endpoints: (builder) => ({
    getCustomers: builder.query({
      query: () => ({url:'customers', method: 'GET'}),
      providesTags: ['Customer']
    }),

    getCustomerById: builder.query({
    query: (id) => ({
        url: `customers/${id}`,
        method: 'GET'
    }),
    providesTags: (result, error, id) => [{ type: 'Customer', id }]
    }),

  getProject: builder.query({
    query: ({ customerId, projectId }) => ({
      url: `customers/${customerId}/projects/${projectId}`,
      method: 'GET'
    }),
    // Transform the response to include architecture files
    async transformResponse(baseQueryReturnValue, meta, arg) {
      try {
        // Get architecture files from S3
        const arcFiles = await getArchitectureFilesFromS3();
        
        // Get files for this specific project
        const arcFilesUrl = arcFiles ? 
          getArchitectureFilesByProjectId(arg.projectId, arcFiles) : 
          [];
        
        // Return the project with architecture files
        return {
          ...baseQueryReturnValue,
          architectureFiles: arcFilesUrl || []
        };
      } catch (error) {
        console.error('Error fetching architecture files:', error);
        // Return the original response if there's an error
        return {
          ...baseQueryReturnValue,
          architectureFiles: []
        };
      }
    },
    providesTags: ['Project']
  }),

    getProjects: builder.query({
      query: (customerId) => ({url:`customers/${customerId}/projects`, method:'GET'}),
      providesTags: ['Project']
    }),

    deleteProject: builder.mutation({
      query: ({ customerId, projectId }) => ({
        url: `customers/${customerId}/projects/${projectId}/delete`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Project', 'Customer', 'CustomerHistory', 'ProjectHistory']
    }),

    updateProjectKeywords: builder.mutation({
        query: ({ customerId, projectId, keywords }) => {
        return { 
            url:
            `customers/${customerId}/projects/${projectId}/keywords`,
            method: 'POST',
            data: keywords
            }
        },
        invalidatesTags: ['Project', 'CustomerHistory', 'ProjectHistory', 'Customer']
    }),

    updateCustomerByProperty: builder.mutation({
      query: ({ customerId, property, data }) => {
        return {
          url: `customers/${customerId}/${property}`,
          method: 'POST',
          data,
        };
      },
      invalidatesTags: ['Customer', 'CustomerHistory']
    }),

    updateSummary: builder.mutation({
      query: ({ customerId, projectId, summary }) => {
        return {
          url: `customers/${customerId}/projects/${projectId}/summary`,
          method: 'POST',
          data: summary,
        };
      },
      invalidatesTags: ['Project', 'CustomerHistory', 'ProjectHistory', 'Customer']
    }),

    updateProjectByProperty: builder.mutation({
      query: ({ customerId, projectId, property, data }) => {
        return {
          url: `customers/${customerId}/projects/${projectId}/${property}`,
          method: 'POST',
          data,
        };
      },
      invalidatesTags: ['Project', 'CustomerHistory', 'ProjectHistory', 'Customer']
    }),
    getCustomerHistory: builder.query({
      query: (customerId) => ({url:`customers/${customerId}/history`,method:'GET'}),
      providesTags: ['CustomerHistory']
    }),

    getProjectHistory: builder.query({
      query: ({customerId, projectId}) => ({url:`customers/${customerId}/projects/${projectId}/history`,method:'GET'}),
      providesTags: ['ProjectHistory']
    }),

    downloadAnalytics: builder.mutation<Blob, void>({
      query: () => ({
        url: '/customers/analytics/xlsx',
        method: 'GET',
        responseType: 'blob',
        headers: {
          Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      }),
    }),

  }),
});

export const {
  useGetCustomersQuery,
  useGetCustomerByIdQuery,
  useGetProjectQuery,
  useUpdateProjectKeywordsMutation,
  useGetCustomerHistoryQuery,
  useGetProjectHistoryQuery,
  useDeleteProjectMutation,
  useGetProjectsQuery,
  useDownloadAnalyticsMutation,
  useUpdateSummaryMutation,
  useUpdateProjectByPropertyMutation,
  useUpdateCustomerByPropertyMutation
} = api;
