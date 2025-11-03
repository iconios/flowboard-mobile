import * as SecureStore from 'expo-secure-store';

class SecureCookieManager {
    static async setCookie(name: string, value: string, options: {expires?: string, secure: boolean}) {
        try {
            const cookieValue = {
            value,
            expires: options.expires || "",
            secure: options.secure,
            createdAt: new Date().toISOString(),
        }
            await SecureStore.setItemAsync(`cookie-${name}`, JSON.stringify(cookieValue));
            return true;
        } catch (error) {
            console.error(`Error setting cookie for ${name}`, error);

            return false;
        }
    }

    static async getCookie(name: string) {
        try {
            // 1. Get and validate the cookie name received
            if (!name) return null;

            // 2. Get the cookie string from the store
            const cookieString = await SecureStore.getItemAsync(`cookie-${name}`);
            if (!cookieString) return null;            
            const cookieData = JSON.parse(cookieString);

            // 3. Ensure that the cookie hasn't expired
            if (cookieData.expires && new Date() > new Date(cookieData.expires)) {
                await this.deleteCookie(name);
                return null;
            }

            // 4. Return the cookie value
            return cookieData.value;
        } catch (error) {
            console.error(`Error getting cookie for ${name}`, error)

            return null;
        }
    }

    static async deleteCookie (name: string) {
        try {
            // 1. Get and validate the cookie name received
            if (!name) return null;

            // 2. Delete the cookie string from the store
            await SecureStore.deleteItemAsync(`cookie-${name}`);
            
            // 3. Return true
            return true;
        } catch (error) {
            console.error(`Error deleting cookie for ${name}`, error);
            return false;
        }
    }

    static async hasCookie(name: string) {
        const value = await SecureStore.getItemAsync(`cookie-${name}`);
        return value !== null;
    }
}

export default SecureCookieManager;