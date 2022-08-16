const result = document.querySelector('.result');

const fetchData = async () => {
  try {
    const { data } = await axios.get('/api/2-basic-api');
    const products = data
      .map((product) => {
        const {
          image: { url: img },
          id,
          name,
          price,
        } = product;

        return `
        <article class="product" id=${id}>
      <img
        src="${img}"  alt="${name}"
      />
      <div class="info">
        <h5>${name}</h5>
        <h5 class="price">$${price}</h5>
      </div>
    </article>
        `;
      })
      .join('');

    result.innerHTML = products;
  } catch (error) {
    console.log(error);
    result.innerHTML = `<h2>Try again later...</h2>`;
  }
};

fetchData();
