import axios from 'axios'

const baseUrl='https://mini-audit-trail-generator-be.onrender.com'
// const baseUrl="http://localhost:8000"
const api=axios.create({
    baseURL:baseUrl
})
export default api