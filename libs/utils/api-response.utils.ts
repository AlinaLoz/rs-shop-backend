interface IResponse {
	statusCode: number
	headers: Object,
	body: Object
}

const defaultHeaders = {
	'Access-Control-Allow-Methods': '*',
	'Access-Control-Allow-Headers': '*',
	'Access-Control-Allow-Origin': '*'
};

const errorResponse = ( err: Error, statusCode= 500 ): IResponse => {
	return {
		statusCode,
		headers: defaultHeaders,
		body: JSON.stringify( { message: err.message || 'Internal server error' })
	}
}

const successResponse = ( body: any, statusCode = 200 ): IResponse => {
	return {
		statusCode,
		headers: defaultHeaders,
		body: JSON.stringify( body )
	}
}

export { errorResponse, successResponse, IResponse };
