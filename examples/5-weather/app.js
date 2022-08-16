// it takes few minutes

const form = document.querySelector('.form');
const input = document.querySelector('.form-input');
const alert = document.querySelector('.alert');
const result = document.querySelector('.result');
alert.style.display = 'none';

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const city = input.value.trim();

  if (!city) return;

  getWeatherData(city);
});

async function getWeatherData(city) {
  alert.style.display = 'none';

  try {
    const { data } = await axios.post('/api/5-weather', { city });
    console.log(data);
    const { name } = data;
    const { country } = data.sys;
    const { temp_max: max, temp_min: min, feels_like } = data.main;
    const { description } = data.weather[0];

    result.innerHTML = `
    <article class="card">
    <h3> ${name}, ${country}</h3>
    <p> ${description}</p>
    <p>Min temp: ${min}&#8451</p>
    <p>Max temp: ${max}&#8451</p>
    <p>Feels like: ${feels_like}&#8451</p>
    </article>
    `;
  } catch (error) {
    alert.style.display = 'block';
    alert.textContent = `Can't find weather data for city: "${city}"`;
  }
}
