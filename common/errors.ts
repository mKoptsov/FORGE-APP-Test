class HttpError extends Error {
	private code: string;

	constructor(message: string, { code }: {code: string}){
  	super(message);
		this.code = code;
	}

}
