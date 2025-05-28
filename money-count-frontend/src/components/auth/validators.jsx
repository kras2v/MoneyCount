export const validateEmail = (email) => {
		return String(email)
			.toLowerCase()
			.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/
			);
	};

export const validatePassword = (password) => {
	const errors = [];

	if (password.length < 6) {
		errors.push("Password must be at least 6 characters long.");
	}
	if (!/[a-z]/.test(password)) {
		errors.push("Password must contain at least one lowercase letter.");
	}
	if (!/[A-Z]/.test(password)) {
		errors.push("Password must contain at least one uppercase letter.");
	}
	if (!/\d/.test(password)) {
		errors.push("Password must contain at least one number.");
	}
	if (!/[!@#$%^&*()_+={}\[\]|\\:;\"'<>?,./`~-]/.test(password)) {
		errors.push("Password must contain at least one special character.");
	}

	return errors.length === 0 ? null : errors;
};

export const validateName = (name) => {
	let names = name.split(" ");
	names.forEach(element => {
		if (!String(element)
			.toLowerCase()
			.match(
				/^[A-Za-z]+$/
			)) {
				return false;
			}
	});
	return true;
};
