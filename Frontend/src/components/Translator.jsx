import { useState, useEffect } from 'react';
import { Box, Button, Center, Flex, Textarea, Select, Text, VStack, useColorMode, IconButton, Skeleton } from "@chakra-ui/react";
import { GoArrowSwitch } from "react-icons/go";
import { FaSun, FaMoon } from 'react-icons/fa';
import axios from "axios";

export const Translator = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const [languages, setLanguages] = useState([]);
    const [inputText, setInputText] = useState("");
    const [translatedText, setTranslatedText] = useState("");
    const [fromLanguage, setFromLanguage] = useState("");
    const [toLanguage, setToLanguage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        axios.get("https://libretranslate.com/languages")
            .then(res => setLanguages(res.data))
            .catch(error => console.error("Error fetching languages:", error));
    }, []);

    const handleTranslate = async () => {
        if (fromLanguage && toLanguage && inputText) {
            setIsLoading(true);
            try {
                const response = await axios.post(`https://api.mymemory.translated.net/get?q=${inputText}&langpair=${fromLanguage}|${toLanguage}`);
                setTranslatedText(response.data.responseData.translatedText);
            } catch (error) {
                console.error("Translation error:", error);
            }
            setIsLoading(false);
        }
    };

    const handleSwapLanguages = () => {
        const tempLanguage = fromLanguage;
        setFromLanguage(toLanguage);
        setToLanguage(tempLanguage);
        setInputText(translatedText);
        setTranslatedText("");
    };

    return (
        <Box>
            <Center>
                <Flex width="100%" justifyContent="space-between" alignItems="center" px={4} py={2}>
                    <Text fontSize={{ base: "xl", md: "4xl", lg: "2xl" }} fontWeight={"600"} color={"teal"}>Translator</Text>
                    <IconButton
                        aria-label="Toggle theme"
                        icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
                        onClick={toggleColorMode}
                    />
                </Flex>
            </Center>
            <Center>
                <Text fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }} fontWeight={"600"} color={"teal"}>Translate your text in any languages</Text>
            </Center>
            <Box border={"2px solid orangeRed"} p={10} mt={10} mx={{ base: 2, md: 10 }}>
                <Flex direction={{ base: 'column', md: 'row' }} gap={10} alignItems={"center"} justifyContent={"center"}>
                    <VStack flex="1">
                        <Select
                            placeholder='Choose language'
                            size='md'
                            width={{ base: "100%", md: "250px" }}
                            value={fromLanguage}
                            onChange={(e) => setFromLanguage(e.target.value)}
                        >
                            {languages.map((language, index) => (
                                <option key={index} value={language.code}>{language.name}</option>
                            ))}
                        </Select>
                        <Box>
                            <Textarea
                                focusBorderColor='lime'
                                placeholder='Write in words'
                                width={{ base: "100%", md: "350px" }}
                                height={{ base: "200px", md: "350px" }}
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                resize="none"
                            />
                        </Box>
                    </VStack>
                    <Button colorScheme='teal' variant='outline' onClick={handleSwapLanguages}>
                        <GoArrowSwitch />
                    </Button>
                    <VStack flex="1">
                        <Select
                            placeholder='Choose language'
                            size='md'
                            width={{ base: "100%", md: "250px" }}
                            value={toLanguage}
                            onChange={(e) => setToLanguage(e.target.value)}
                        >
                            {languages.map((language, index) => (
                                <option key={index} value={language.code}>{language.name}</option>
                            ))}
                        </Select>
                        <Box>
                            <Skeleton isLoaded={!isLoading}>
                                <Textarea
                                    focusBorderColor='lime'
                                    width={{ base: "100%", md: "350px" }}
                                    height={{ base: "200px", md: "350px" }}
                                    value={translatedText}
                                    readOnly
                                    resize="none"
                                />
                            </Skeleton>
                        </Box>
                    </VStack>
                </Flex>
                <Center>
                    <Button colorScheme='teal' variant='outline' onClick={handleTranslate} mt={5}>
                        Translate
                    </Button>
                </Center>
            </Box>
        </Box>
    );
};
