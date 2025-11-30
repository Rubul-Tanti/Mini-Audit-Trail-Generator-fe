import axios from 'axios'

const baseUrl='https://mini-audit-trail-generator-be.onrender.com'
const api=axios.create({
    baseURL:baseUrl
})
export default api