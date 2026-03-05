import type { MemoryBoardState } from "@/lib/memory-board/types";

const DB_NAME = "memory-board-local-db-v1";
const STORE_NAME = "boards";

type LocalBoardRecord = {
  key: string;
  state: MemoryBoardState;
  updated_at: string;
};

let dbPromise: Promise<IDBDatabase> | null = null;

function getIndexedDb() {
  if (typeof window === "undefined" || !window.indexedDB) {
    throw new Error("IndexedDB недоступен в этом браузере");
  }

  return window.indexedDB;
}

function openLocalDatabase() {
  if (dbPromise) {
    return dbPromise;
  }

  dbPromise = new Promise((resolve, reject) => {
    const request = getIndexedDb().open(DB_NAME, 1);

    request.onerror = () => {
      reject(request.error ?? new Error("Не удалось открыть локальную базу данных"));
    };

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: "key" });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };
  });

  return dbPromise;
}

export async function readBoardStateFromStore(storageKey: string) {
  const db = await openLocalDatabase();

  return new Promise<MemoryBoardState | null>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const request = transaction.objectStore(STORE_NAME).get(storageKey);

    request.onerror = () => {
      reject(request.error ?? new Error("Не удалось прочитать локальную доску"));
    };

    request.onsuccess = () => {
      const record = request.result as LocalBoardRecord | undefined;
      resolve(record?.state ?? null);
    };
  });
}

export async function writeBoardStateToStore(storageKey: string, state: MemoryBoardState) {
  const db = await openLocalDatabase();

  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const request = transaction.objectStore(STORE_NAME).put({
      key: storageKey,
      state,
      updated_at: new Date().toISOString(),
    } satisfies LocalBoardRecord);

    request.onerror = () => {
      reject(request.error ?? new Error("Не удалось сохранить локальную доску"));
    };

    transaction.oncomplete = () => {
      resolve();
    };

    transaction.onerror = () => {
      reject(transaction.error ?? new Error("Не удалось завершить сохранение доски"));
    };
  });
}
