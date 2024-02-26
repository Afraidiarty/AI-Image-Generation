import express from 'express';
import Replicate from 'replicate';
import fs from 'fs';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Разрешить доступ со всех доменов (это допустимо только для разработки)
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Разрешенные HTTP методы
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Разрешенные заголовки
  next();
});


const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || "YOUR_TOKEN_REPLACE",
});

app.get('/', async (req, res) => {

  console.log(req.query.prompt);

  try {
    const output = await replicate.run(
      "stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
      {
        input: {
          width: 768,
          height: 768,
          prompt: req.query.prompt,
          scheduler: "K_EULER",
          num_outputs: 1,
          guidance_scale: 7.5,
          num_inference_steps: 50
        }
      }
    );

    const imageUrl = output;

    // Функция для загрузки и сохранения изображения
    async function saveImage() {
      try {
        const response = await axios.get(imageUrl, {
          responseType: 'arraybuffer'
        });

        const __dirname = dirname(fileURLToPath(import.meta.url));

        // Генерируем уникальное имя файла
        const imageName = `image_${Date.now()}.jpg`;
        const imagePath = path.join(__dirname, 'public', imageName);

        fs.writeFile(imagePath, response.data, (err) => {
          if (err) {
            console.error('Ошибка при сохранении изображения:', err);
            return;
          }
          console.log('Изображение успешно сохранено:', imageName);
          res.send(imageName);
          
        });
      } catch (error) {
        console.error('Ошибка при загрузке изображения:', error);
        res.status(500).send('Ошибка при загрузке изображения');
      }
    }

    saveImage();
  } catch (error) {
    console.error('Ошибка при выполнении запроса к API Replicate:', error);
    res.status(500).send('Ошибка при выполнении запроса к API Replicate');
  }
});

app.listen(3002, () => {
  console.log('Server is running on port 3002');
});
