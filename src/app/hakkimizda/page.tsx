import { permanentRedirect } from "next/navigation";

export default function HakkimizdaRedirect(): never {
  permanentRedirect("/about");
}
