export function emailValidator(email) {
  const re = /\S+@\S+\.\S+/
  if (!email) return "Đừng quên thêm địa chỉ email của bạn"
  if (!re.test(email)) return 'Ooops! We need a valid email address.'
  return ''
}
