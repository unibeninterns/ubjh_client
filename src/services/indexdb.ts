const DB_NAME = "hms-portal";
const DB_VERSION = 1;
const TOKEN_STORE = "auth-tokens";

interface TokenData {
  id: string;
  value: string;
  timestamp: number;
}

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    console.log("Initializing IndexedDB");

    if (typeof window === "undefined" || !window.indexedDB) {
      console.error(
        "Your browser doesn't support IndexedDB or running on server"
      );
      reject("IndexedDB not supported");
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error(
        "IndexedDB error:",
        (event.target as IDBOpenDBRequest)?.error
      );
      reject(
        `IndexedDB error: ${(event.target as IDBOpenDBRequest)?.error?.message}`
      );
    };

    request.onsuccess = (event) => {
      console.log("IndexedDB initialized successfully");
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onupgradeneeded = (event) => {
      console.log("Creating/upgrading IndexedDB schema");
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(TOKEN_STORE)) {
        db.createObjectStore(TOKEN_STORE, { keyPath: "id" });
        console.log("Token store created");
      }
    };
  });
};

export const saveTokens = async (
  accessToken: string,
  refreshToken?: string
): Promise<boolean> => {
  if (!accessToken) {
    console.error("Attempted to save null/undefined access token");
    return false;
  }

  try {
    console.log("Saving tokens to IndexedDB");
    const db = await initDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([TOKEN_STORE], "readwrite");

      transaction.onerror = (event) => {
        console.error(
          "Transaction error:",
          (event.target as IDBTransaction)?.error
        );
        reject(false);
      };

      const store = transaction.objectStore(TOKEN_STORE);
      const timestamp = Date.now();

      const accessTokenObject: TokenData = {
        id: "accessToken",
        value: accessToken,
        timestamp,
      };

      const accessRequest = store.put(accessTokenObject);

      accessRequest.onerror = (event) => {
        console.error(
          "Error saving access token:",
          (event.target as IDBRequest)?.error
        );
        reject(false);
      };

      if (refreshToken) {
        const refreshTokenObject: TokenData = {
          id: "refreshToken",
          value: refreshToken,
          timestamp,
        };

        const refreshRequest = store.put(refreshTokenObject);

        refreshRequest.onerror = (event) => {
          console.error(
            "Error saving refresh token:",
            (event.target as IDBRequest)?.error
          );
          reject(false);
        };

        refreshRequest.onsuccess = () => {
          console.log("Both tokens saved successfully");
          resolve(true);
        };
      } else {
        accessRequest.onsuccess = () => {
          console.log("Access token saved successfully");
          resolve(true);
        };
      }
    });
  } catch (error) {
    console.error("Failed to save tokens:", error);
    return false;
  }
};

export const getToken = async (
  tokenType: "accessToken" | "refreshToken" = "accessToken"
): Promise<string | null> => {
  try {
    console.log(`Getting ${tokenType} from IndexedDB`);
    const db = await initDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([TOKEN_STORE], "readonly");

      transaction.onerror = (event) => {
        console.error(
          "Transaction error:",
          (event.target as IDBTransaction)?.error
        );
        reject(null);
      };

      const store = transaction.objectStore(TOKEN_STORE);
      const request = store.get(tokenType);

      request.onsuccess = () => {
        const result = request.result as TokenData;
        const token = result ? result.value : null;
        console.log(
          `${tokenType} retrieval:`,
          token ? "Token found" : "No token found"
        );

        if (token && result.timestamp) {
          const tokenAge = Date.now() - result.timestamp;
          const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days

          if (tokenAge > maxAge) {
            console.warn(`${tokenType} is too old, removing it`);
            removeTokens().catch((err) =>
              console.error("Error removing old token:", err)
            );
            resolve(null);
            return;
          }
        }

        resolve(token);
      };

      request.onerror = (event) => {
        console.error(
          `Error getting ${tokenType}:`,
          (event.target as IDBRequest)?.error
        );
        reject(null);
      };
    });
  } catch (error) {
    console.error(`Failed to get ${tokenType}:`, error);
    return null;
  }
};

export const removeTokens = async (): Promise<boolean> => {
  try {
    console.log("Removing all tokens");
    const db = await initDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([TOKEN_STORE], "readwrite");

      transaction.onerror = (event) => {
        console.error(
          "Transaction error:",
          (event.target as IDBTransaction)?.error
        );
        reject(false);
      };

      const store = transaction.objectStore(TOKEN_STORE);

      const accessRequest = store.delete("accessToken");
      const refreshRequest = store.delete("refreshToken");

      let completedRequests = 0;
      const totalRequests = 2;

      const checkCompletion = () => {
        completedRequests++;
        if (completedRequests === totalRequests) {
          console.log("All tokens removed successfully");
          resolve(true);
        }
      };

      accessRequest.onsuccess = checkCompletion;
      refreshRequest.onsuccess = checkCompletion;

      accessRequest.onerror = (event) => {
        console.error(
          "Error removing access token:",
          (event.target as IDBRequest)?.error
        );
        reject(false);
      };

      refreshRequest.onerror = (event) => {
        console.error(
          "Error removing refresh token:",
          (event.target as IDBRequest)?.error
        );
        reject(false);
      };
    });
  } catch (error) {
    console.error("Failed to remove tokens:", error);
    return false;
  }
};
