declare module 'config' {
	
	export const POSTGRES: {
		readonly HOST: string;
		readonly PORT: number;
		readonly USERNAME: string;
		readonly PASSWORD: string;
		readonly DB: string;
	};
}
