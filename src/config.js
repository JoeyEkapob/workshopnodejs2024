const config = { 
    apiPath : 'http://localhost:3001', // localhost != locathost : ERROR
    headers: () => {
        return {
            headers:{
                Authorization : localStorage.getItem('token')
            }
        }
    }
}
export default config;