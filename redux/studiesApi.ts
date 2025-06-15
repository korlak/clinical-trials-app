import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const studiesApi = createApi({
  reducerPath: 'studiesApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://clinicaltrials.gov/api/v2/' }),
  endpoints: (builder) => ({
    getStudies: builder.query<any, void>({
      query: () => 'studies',
    }),
    getByNctId: builder.query<any, string>({
      query: (nctId) => `studies/${nctId}`,
    }),
    searchStudies: builder.query<any, { nctId?: string; briefTitle?: string; condition?: string; pageToken?: string }>({
      query: ({ nctId, briefTitle, condition, pageToken }) => {
        const params = new URLSearchParams();
        if (nctId) params.append('query.id', nctId);
        if (briefTitle) params.append('query.term', briefTitle);
        if (condition) params.append('query.cond', condition);
        params.append('countTotal', 'true');
        params.append('fields', [
          'protocolSection.identificationModule.nctId',
          'protocolSection.identificationModule.briefTitle',
          'protocolSection.conditionsModule.conditions'
        ].join(','));
        params.append('pageSize', '5');
        if (pageToken) params.append('pageToken', pageToken);
        return `studies?${params.toString()}`;
      },
    }),
  }),
});

export const { useGetStudiesQuery, useGetByNctIdQuery, useSearchStudiesQuery } = studiesApi;