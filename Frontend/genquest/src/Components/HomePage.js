import * as React from "react";
import Saved from '../Assets/SavedQuestions.png';
import Logo from '../Assets/logo.png';
import { useState, useEffect } from 'react';
import axios from 'axios';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import 'pdfjs-dist/web/pdf_viewer.css';

export default function HomePage(props) {
    const [generatedQuestions, setGeneratedQuestions] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState('');
    const [selectedTopicText, setSelectedTopicText] = useState('');
    const [pdf, setPdf] = useState(null);
    const [setSelectedPage] = useState(1); 
    const [bookDetails, setBookDetails] = useState({ 
        title: '',
        author: '',
        pageCount: 0,
        tableOfContents: []
    });

    const generateQuestions = () => {
        axios.post('http://127.0.0.1:5000/generate_questions', { text: selectedTopicText })
            .then(response => {
                setGeneratedQuestions(response.data.questions);
                console.log(response);
            })
            .catch(error => {
                console.error('Error generating questions:', error);
            });
    };
    const SaveQuestions = async () => {
        // Retrieve id from localStorage
        const userId = localStorage.getItem('id');
        
        // Check if userId is present
        if (!userId) {
            console.error('User id not found in localStorage');
            return;
        }
    
        // Check if generatedQuestions is present
        if (generatedQuestions.length === 0) {
            console.error('No generated questions to save');
            return;
        }
    
        try {
            const response = await axios.post('http://127.0.0.1:3001/auth/save', { userId, generatedQuestions });
            console.log(response);
            alert('Questions saved successfully');
        } catch (error) {
            console.error('Error Saving questions:', error);
            alert('Error saving questions');
        }
    };
        

    useEffect(() => {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.js`;
    }, []);

    const handleTopicChange = async (event) => {
        const selectedTopicTitle = event.target.value;
        const selectedTopic = bookDetails.tableOfContents.find(item => item.title === selectedTopicTitle);
        if (selectedTopic) {
            try {
                const pageNumber = selectedTopic.page.num; 
                if (pageNumber >= 1 && pageNumber <= bookDetails.pageCount) { 
                    const page = await pdf.getPage(pageNumber);
                    const content = await page.getTextContent();
                    console.log('Content:', content);
                    let text = '';
                    for (const item of content.items) {
                        text += item.str + ' ';
                        if (text.split(' ').length > 500) break;
                    }
                    setSelectedTopic(selectedTopicTitle);
                    setSelectedTopicText(text);
                    setSelectedPage(pageNumber); // Update selected page number
                } else {
                    console.error('Invalid page number:', pageNumber);
                }
            } catch (error) {
                console.error('Error extracting topic text:', error);
            }
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = async (e) => {
            const arrayBuffer = e.target.result;
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

            const metadata = await pdf.getMetadata();
            const numPages = pdf.numPages;

            const tableOfContents = await extractTableOfContents(pdf);

            setBookDetails({
                title: metadata.info.Title || 'Title not found',
                author: metadata.info.Author || 'Author not found',
                pageCount: numPages,
                tableOfContents: tableOfContents
            });
            setPdf(pdf);

            // Set initial selected topic text to the first topic
            if (tableOfContents.length > 0) {
                const initialTopic = tableOfContents[0];
                handleTopicChange({ target: { value: initialTopic.title } });
            }
        };

        reader.readAsArrayBuffer(file);
    };

    const extractTableOfContents = async (pdf) => {
        const outlines = await pdf.getOutline();
        if (!outlines) return [];

        const tableOfContents = [];

        const processOutline = (outline, depth) => {
            outline.forEach(item => {
                tableOfContents.push({ title: item.title, depth: depth, page: item.dest[0] });
                if (item.items) {
                    processOutline(item.items, depth + 1);
                }
            });
        };

        processOutline(outlines, 0);

        return tableOfContents;
    };


    return (
        <div className="flex flex-col pb-5 bg-white">
            <div className="flex overflow-hidden relative flex-col items-center pt-5 pr-20 pb-12 pl-10 w-full text-white min-h-[560px] max-md:px-5 max-md:max-w-full">
                <img
                    loading="lazy"
                    srcSet={Saved}
                    alt="bg"
                    className="object-cover absolute inset-0 size-full"
                />
                <div className="flex relative flex-col justify-center px-7 py-2 max-w-full font-medium bg-black rounded-[100px] w-[890px] max-md:px-5">
                    <div className="flex gap-5 justify-between items-center w-full max-md:flex-wrap max-md:max-w-full">
                        <img
                            loading="lazy"
                            srcSet={Logo}
                            alt="logo"
                            className="self-stretch aspect-[1.06] w-[70px]"
                        />
                        <div className="flex gap-5 justify-between self-stretch my-auto text-xl">
                            <div>HOME</div>
                            <div className="flex-auto">Saved Questions</div>
                        </div>
                        <div className="flex flex-col justify-center self-stretch my-auto text-lg whitespace-nowrap">
                            <div className="justify-center px-14 py-5 bg-sky-500 rounded-[100px] max-md:px-5">
                                Login
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex relative flex-col mt-20 mb-24 w-full capitalize max-w-[1126px] max-md:my-10 max-md:max-w-full">
                    <div className="text-8xl font-bold leading-[100px] max-md:max-w-full max-md:text-4xl">
                        GEN QUEST
                    </div>
                    <div className="mt-6 text-3xl font-medium leading-9 max-md:max-w-full">
                        Unlock Knowledge: Auto Question Generator, Transforming Books into
                        Learning Adventures
                    </div>
                </div>
            </div>
            <div className="flex justify-center w-3/4 mx-auto">
                {/* First Column */}
                <div className="flex flex-col w-1/2 max-md:w-full">
                    {/* Select Book and Book Details Box */}
                    <div className="flex flex-col w-full">

                        <div className="flex flex-col px-6 py-3.5 mt-5 max-md:px-5 max-md:max-w-full">
                            <div className="max-md:max-w-full ml-1 text-xl font-semibold text-gray-800">Select Book</div>
                            <input
                                type="file"
                                onChange={handleFileUpload}
                                className="self-start mt-3 ml-1 text-sm flex-auto border-2 mb-5 border-solid border-gray-300 text-black text-opacity-75 max-md:ml-2.5 p-2 w-full rounded-md"
                            />
                            <div className="capitalize max-md:max-w-full ml-1 text-xl font-semibold text-gray-800">Book Title:</div>
                            <input
                                type="text"
                                value={bookDetails.title}
                                readOnly
                                className="self-start mt-3 ml-1 text-sm flex-auto border-2 border-solid border-gray-300 text-black text-opacity-75 max-md:ml-2.5 p-2 w-full rounded-md"
                            />
                            <div className="mt-3 capitalize max-md:max-w-full ml-1 text-xl font-semibold text-gray-800">Author Name:</div>
                            <input
                                type="text"
                                value={bookDetails.author}
                                readOnly
                                className="self-start mt-3 ml-1 text-sm flex-auto border-2 border-solid border-gray-300 text-black text-opacity-75 max-md:ml-2.5 p-2 w-full rounded-md"
                            />
                            <div className="mt-3 capitalize max-md:max-w-full ml-1 text-xl font-semibold text-gray-800">Select Topic:</div>
                            <select
                                value={selectedTopic}
                                onChange={(event) => handleTopicChange(event)}
                                className="self-start mt-3 ml-1 text-sm flex-auto border-2 border-solid border-gray-300 text-black text-opacity-75 max-md:ml-2.5 p-2 w-full rounded-md"
                            >
                                <option value="">Select Topic</option>
                                {bookDetails.tableOfContents.map((item, index) => (
                                    <option key={index} value={item.title}>
                                        {item.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col mt-5 w-full">
                    <div className="max-md:max-w-full ml-6 text-xl font-semibold text-gray-800">Selected Topic Text</div>
                        <div className="px-6 py-3.5 mt-5 overflow-y-automax-md:px-5 max-md:max-w-full">
                            <textarea
                                value={selectedTopicText}
                                onChange={(e) => setSelectedTopicText(e.target.value)}
                                className="w-full h-40 p-2 border-2 border-gray-300 rounded-md resize-none"
                            />
                            <button
                                onClick={generateQuestions}
                                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
                            >
                                Generate Questions
                            </button>
                        </div>
                    </div>
                </div>


                <div className="flex flex-col w-1/2 max-md:w-full">

                    <div className="max-md:max-w-full ml-6 text-xl font-semibold text-gray-800 mt-9">Table of Contents</div>
                    <div className="px-6 py-3.5  overflow-y-auto max-md:px-5 max-md:max-w-full">
                        <div className="w-full h-80 p-2 border-2 border-gray-300 rounded-md overflow-y-auto resize-none" style={{ userSelect: 'none' }}>
                            {bookDetails.tableOfContents.map((item, index) => (
                                <div key={index} className={`ml-${item.depth * 4} mb-2`}>
                                    {item.title}
                                </div>
                            ))}
                        </div>
                    </div>


                    <div className="flex flex-col w-full">
                        <div className="max-md:max-w-full ml-6 mt-7 text-xl font-semibold text-gray-800">Generated Questions</div>
                        <div className="px-6 py-3.5 mt-4 overflow-y-auto max-md:px-5 max-md:max-w-full">
                            <div className="w-full h-40 p-2 border-2 border-gray-300 rounded-md overflow-y-auto resize-none" style={{ userSelect: 'none' }}>
                                {generatedQuestions.length > 0 ? (
                                    <ul>
                                        {generatedQuestions.map((question, index) => (
                                            <li key={index}>
                                                <div>
                                                    <strong>Question:</strong> {question.question}
                                                </div>
                                                {Array.isArray(question.answer) ? (
                                                    <div>
                                                        <strong>Answer:</strong>
                                                        <ul>
                                                            {question.answer.map((item, idx) => (
                                                                <li key={idx}>
                                                                    {item.correct ? <strong>{item.answer}</strong> : item.answer}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <strong>Answer:</strong> {question.answer}
                                                    </div>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No questions generated yet.</p>
                                )}
                                
                            </div>
                            <button
                                onClick={SaveQuestions}
                                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
                            >
                                Save Questions
                            </button>
                        </div>
                       
                    </div>
            
                </div>
                
            </div>

        </div>
    );
}