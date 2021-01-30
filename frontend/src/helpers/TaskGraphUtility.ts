import { store } from "../store/taskGraph";

const getProperty = (path: string) => store.getters.getPropertyFromPath(path);
const setProperty = (payload: { path: string; value: any }) => store.dispatch("setPropertyFromPath", payload);

export { getProperty, setProperty, store };
