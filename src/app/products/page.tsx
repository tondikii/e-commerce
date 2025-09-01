import {Suspense, type FC} from "react";
import ProductPageView from "./View";
import {PageLoader} from "@/components";

const ProductPage: FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <ProductPageView />
    </Suspense>
  );
};
export default ProductPage;
