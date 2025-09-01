import {Suspense, type FC} from "react";
import CheckoutPageView from "./View";
import {PageLoader} from "@/components";

const CheckoutPage: FC = ({}) => {
  return (
    <Suspense fallback={<PageLoader />}>
      <CheckoutPageView />
    </Suspense>
  );
};
export default CheckoutPage;
