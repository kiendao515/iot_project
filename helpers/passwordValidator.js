export function passwordValidator(password) {
  if (!password) return "Hãy nhập mật khẩu"
  if (password.length < 5) return 'Password must be at least 5 characters long.'
  return ''
}
