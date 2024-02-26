import {
  ChakraProvider,
  Heading,
  Container,
  Text,
  Input,
  Button,
  Wrap,
  Stack,
  Image,
  Link,
  SkeletonCircle,
  SkeletonText,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";

const App = () => {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState(null); // Состояние для хранения ссылки на изображение

  const generate = async (prompt) => {
    try {
      const response = await axios.get('http://localhost:3002', { params: { prompt } });
      console.log(response.data);
      setImageUrl(response.data);
      

    } catch (error) {
      console.error('Ошибка при отправке данных на сервер:', error);
    }
  };
  

  return (
    <ChakraProvider>
      <Container>
        <Heading>Creating IMAGES🚀</Heading>
        <Text marginBottom={"10px"}>
          Input something if you want generate pictures{" "}
        </Text>

      

        <Wrap marginBottom={"10px"}>
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            width={"350px"}
          ></Input>
          <Button onClick={(e) => generate(prompt)} colorScheme={"yellow"}>
            Generate
          </Button>
        </Wrap>

        {imageUrl && (
          <img src={"http://localhost:3002/" + imageUrl} alt="Generated Image" style={{ marginBottom: "10px" }} />
        )}

        <Stack>
          <SkeletonCircle />
          <SkeletonText />
        </Stack>
      </Container>
    </ChakraProvider>
  );
};

export default App;
