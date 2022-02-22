import Layout from "../../components/Layout";
import NextLink from "next/link";
import Image from "next/image";
import {
  Link,
  Grid,
  List,
  ListItem,
  Typography,
  Card,
  Button,
} from "@material-ui/core";
import useStyles from "../../utils/styles";
import Product from "../../models/Product";
import database from "../../utils/db";
import axios from "axios";
import { useContext } from "react";
import { Store } from "../../utils/Store";
import { useRouter } from "next/router";

function ProductDetail(props) {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const classes = useStyles();
  // const router = useRouter();
  // const { slug } = router.query;
  const { product } = props;
  if (!product) return <div>Product Not found</div>;
  const addToCartHandler = async function () {
    const existItem = state.cart.cartItems.find(
      (item) => item._id === product._id
    );
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert("Sorry, product is out of stock");
      return;
    }
    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity: quantity },
    });
    router.push("/cart");
  };
  return (
    <Layout title={product.name} description={product.description}>
      <div className={classes.section}>
        <NextLink passHref href="/">
          <Typography>
            <Link>Back to products</Link>
          </Typography>
        </NextLink>
      </div>
      <Grid container spacing={1}>
        <Grid item md={6} xs={12}>
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            layout="responsive"
          ></Image>
        </Grid>
        <Grid item md={3} xs={12}>
          <List>
            <ListItem>
              <Typography component="h1" variant="h1">
                {product.name}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography>Category: {product.category}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Brand: {product.brand}</Typography>
            </ListItem>
            <ListItem>
              <Typography>
                Rating: {product.rating} of {product.numReviews}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography>Description: {product.description}</Typography>
            </ListItem>
          </List>
        </Grid>
        <Grid item md={3} xs={12}>
          <Card>
            <List>
              <ListItem>
                <Grid container>
                  <Grid item md={6} xs={6}>
                    <Typography>Price</Typography>
                  </Grid>
                  <Grid item md={6} xs={6}>
                    <Typography>${product.price}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item md={6} xs={6}>
                    <Typography>Status</Typography>
                  </Grid>
                  <Grid item md={6} xs={6}>
                    <Typography>
                      {product.countInStock > 0 ? "In Stock" : "Unavailable"}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={addToCartHandler}
                >
                  Add to cart
                </Button>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default ProductDetail;

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;
  await database.connect();
  const product = await Product.findOne({ slug }).lean();
  await database.disconnect();
  return {
    props: {
      product: database.convertDocToObject(product),
    },
  };
}
