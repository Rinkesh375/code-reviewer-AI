import LoginUI from "@/module/components/login-ui";
import { requireUnAuth } from "@/module/utils/auth-utils";

export default async function Page() {
  await requireUnAuth();

  return (
    <div>
      <LoginUI />
    </div>
  );
}
