import { rb32 } from "../lib/rb32";

export const generateTotpKey = () => rb32() + rb32();
