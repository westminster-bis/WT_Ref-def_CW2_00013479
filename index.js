const express = require("express");
const app = express();

const PORT = 8000;

app.set("view engine", "pug");
app.use("/static", express.static("assets"));
app.use(express.urlencoded({ extended: false }));

const fs = require("fs");

//get product function
app.get("/", (req, res) => {
  fs.readFile("./data/products.json", (err, data) => {
    if (err) throw err;

    const products = JSON.parse(data);
    const unarchivedproducts = products.filter((product) => product.archived == false);
    res.render("home", { products: unarchivedproducts });
  });
});

//create product function

app.post("/add", (req, res) => {
  const formData = req.body;
  if (
    formData.name == "" ||
    formData.description == ""
  ) {
    fs.readFile("./data/products.json", (err, data) => {
      if (err) throw err;

      const products = JSON.parse(data);
      const unarchivedproducts = products.filter(
        (product) => product.archived == false
      );
      res.render("home", { products: unarchivedproducts });
    });
  } else {
    fs.readFile("./data/products.json", (err, data) => {
      if (err) throw err;

      const products = JSON.parse(data);

      const product = {
        id: create_id(),
        archived: false,
        name: formData.name,
        description: formData.description,
      };

      products.push(product);

      fs.writeFile("./data/products.json", JSON.stringify(products), (err) => {
        if (err) throw err;

        fs.readFile("./data/products.json", (err, data) => {
          if (err) throw err;

          const products = JSON.parse(data);
          const unarchivedproducts = products.filter(
            (product) => product.archived == false
          );
          res.render("home", { products: unarchivedproducts, success: true });
        });
      });
    });
  }
});

app.get("/create", (req, res) => {
  res.render("create");
});

//delete product function

app.get("/:id/delete", (req, res) => {
  const id = req.params.id;

  fs.readFile("./data/products.json", (err, data) => {
    if (err) throw err;

    const products = JSON.parse(data);
    const filteredproducts = products.filter((product) => product.id != id);

    fs.writeFile(
      "./data/products.json",
      JSON.stringify(filteredproducts),
      (err) => {
        if (err) throw err;

        res.redirect('/')        
      }
    );
  });
});

//update

app.get("/:id/update", (req, res) => {
  const id = req.params.id;

  fs.readFile("./data/products.json", (err, data) => {
    if (err) throw err;

    const products = JSON.parse(data);

    const filteredproducts = products.filter((product) => product.id == id);
    res.render("update", { edit: true, products: filteredproducts });
  });
});

//couldn`t properly implement the update function
app.post("/update", (req, res) => {
  const formData = req.body;
  const ID = req.params.id;
  fs.readFile("./data/products.json", (err, data) => {
    if (err) throw err;

    const products = JSON.parse(data);
    const product = products.find((product) => (product.id = ID));
    const productIdx = products.indexOf(product);
    const splicedproduct = products.splice(productIdx, 1)[0];

    splicedproduct.id = ID;
    splicedproduct.name = formData.name;
    splicedproduct.archived = false;
    splicedproduct.description = formData.description;

    products.push(splicedproduct);

    fs.writeFile("./data/products.json", JSON.stringify(products), (err) => {
      if (err) throw err;
      res.redirect('/')
    });
  });
});

//render archived page
app.get("/archived", (req, res) => {
  fs.readFile("./data/products.json", (err, data) => {
    if (err) throw err;

    const products = JSON.parse(data);

    const archivedproducts = products.filter((product) => product.archived == true);
    res.render("archived", { products: archivedproducts });
  });
});


//archive a product function
app.get("/:id/archive", (req, res) => {
  const id = req.params.id;

  fs.readFile("./data/products.json", (error, data) => {
    if (error) throw error;

    const products = JSON.parse(data);
    const product = products.find((product) => product.id == id);

    let idx = products.indexOf(product);

    products[idx].archived = true;

    fs.writeFile("./data/products.json", JSON.stringify(products), (error) => {
      if (error) throw error;
      res.redirect("/archived");
    });
  });
});


//unarchive a product
app.get("/:id/unarchive", (req, res) => {
  const id = req.params.id;

  fs.readFile("./data/products.json", (error, data) => {
    if (error) throw error;

    const products = JSON.parse(data);
    const product = products.find((product) => product.id == id);

    let idx = products.indexOf(product);

    products[idx].archived = false;

    fs.writeFile("./data/products.json", JSON.stringify(products), (error) => {
      if (error) throw error;
      res.redirect("/archived");
    });
  });
});

// shows details

app.get("/:id", (req, res) => {
  const id = req.params.id;

  fs.readFile("./data/products.json", (err, data) => {
    if (err) throw err;

    const products = JSON.parse(data);

    const filteredproducts = products.filter((product) => product.id == id);
    res.render("details", { products: filteredproducts });
  });
});

//random id function
function create_id() {
  return "_" + Math.random().toString(36).substr(2, 9);
}

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`This app is running on port ${PORT}`);
});
