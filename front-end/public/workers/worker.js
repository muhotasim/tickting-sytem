self.onmessage = function (event) {
    const getEvents = async () => {
        try {
            const data = event.data;
            const response = await fetch(data.apiUrl + '/events', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${data.token}`
                }
            })
            const result = await response.json()
            self.postMessage(result)
        } catch (error) {
            self.postMessage({ error: error.message });
        }
    }
    getEvents();
};