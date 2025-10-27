const signup = (req, res) => {
	res.send('Signup Endpoint')
}
const login = (req, res) => {
	res.send('Login Endpoint')
}
const logout = (req, res) => {
	res.send('Logout Endpoint')
}

export const authController = {
	signup,
	login,
	logout,
}
