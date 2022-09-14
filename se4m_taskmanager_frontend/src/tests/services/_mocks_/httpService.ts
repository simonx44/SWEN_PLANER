export const getUnauthorizedAxios = jest.fn();

export const getAxiosReponse = (status: number, data: any) => {
    return {
        // `data` is the response that was provided by the server
        data,

        status,

        statusText: "OK",

        headers: {},

        config: {},

        request: {},
    };
};

export const createAxiosMock = (statusCode: number, response: any) => {
    const createReponse = () => getAxiosReponse(statusCode, response);

    return {
        get: createReponse,
        post: createReponse,
        delete: createReponse,
        patch: createReponse,
    };
};
