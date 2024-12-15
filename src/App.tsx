import './App.css';
import Editor from '@monaco-editor/react';
import styles from "./styles.module.css";
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Button, Box, Paper } from '@mui/material';
import { SetStateAction, useEffect, useState } from 'react';
import { createServer } from "miragejs";
import Task from './types/Task';
import Result from './types/Result';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { red } from '@mui/material/colors';

createServer({
    routes() {
        this.get("/api/tasks/1", () => (
            {
                id: "1",
                title: "Sum of positive",
                description: "You get an array of numbers, return the sum of all of the positives ones.",
                examples: [{ id: 1, text: "[1, -4, 7, 12] => 1+7+12=20 1 + 7 + 12 = 20 1+7+12=20" }],
                note: "If there is nothing to sum, the sum is default to 0",

            }));

        this.post("/api/solution", () => {

            const random = Math.random();
            if (random < .5) {
                return {
                    taskId: '1',
                    status: 'success',
                    output: 'Все тесты успешно пройдены'
                };
            }
            else {
                return {
                    taskId: '1',
                    status: 'failure',
                    error: 'Ошибка: индекс вне диапазона',
                    output: "Некоторые тесты не были пройдены"
                };
            }
        });
    },
});

function App() {
    const [lang, setLang] = useState<'python' | 'go'>('go');
    const [task, setTask] = useState<Task | undefined>();
    const [code, setCode] = useState('');
    const [result, setResult] = useState<Result | undefined>();

    useEffect(() => {
        const fetchTask = async () => {
            fetch('/api/tasks/1')
                .then((response) => response.json())
                .then((json) => setTask(json));
        };

        fetchTask()
            .catch(console.error);

    }, []);


    const handleLangChange = (event: SelectChangeEvent) => {
        setLang(event.target.value as SetStateAction<"python" | "go">);
    };

    const handleCodePost = () => {

        const solution = {
            taskId: task?.id,
            lang: lang,
            code: code
        };

        fetch('/api/solution', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(solution)
        })
            .then(response => response.text())
            .then(response => {
                console.log(response);
                setResult(JSON.parse(response));
            })
            .catch(err => console.log(err));
    };

    const handleEditorChange = (value: string | undefined) => {
        if (value !== undefined)
            setCode(value);
    };

    return (
        <>
            <div className={styles.page}>

                <header className={styles.header}>
                    <img src="./code.png" alt="" />
                    <FormControl
                        size="small"
                        sx={{
                            m: 1,
                            width: "10rem",
                            borderColor: "#fff",
                        }}
                    >
                        <InputLabel
                            id="lang-label"
                            color='primary'
                            sx={{
                                color: "lightgrey",
                                "&.Mui-focused": {
                                    color: "lightgrey",
                                },
                            }}
                        >
                            Язык
                        </InputLabel>
                        <Select
                            labelId="lang-label"
                            id="lang"
                            value={lang}
                            label="Язык"
                            onChange={handleLangChange}
                            sx={{
                                color: "white",
                                '.MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(228, 219, 233, 0.25)',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(228, 219, 233, 0.25)',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(228, 219, 233, 0.25)',
                                },
                                '.MuiSvgIcon-root ': {
                                    fill: "white !important",
                                },
                                '.MuiSelect-icon': {
                                    color: 'white'
                                },
                                ".MuiSelect-outlined": {
                                    color: 'white'
                                }
                            }}
                        >
                            <MenuItem value={'go'}>Go</MenuItem>
                            <MenuItem value={'python'}>Python</MenuItem>
                        </Select>
                    </FormControl>
                </header>

                <main className={styles.task}>

                    <div className={styles.task__desc}>

                        <h1 className={styles.task__title}>
                            {task?.title}
                        </h1>
                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                '& > :not(style)': {
                                    m: 1,
                                    p: 1,
                                    width: 128,
                                    height: 22,
                                    background: "grey",
                                },
                            }}
                        >
                            <Paper elevation={3} >Описание</Paper>
                        </Box>
                        <div className={styles.task__text}>
                            {task?.description}
                        </div>

                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                '& > :not(style)': {
                                    m: 1,
                                    p: 1,
                                    width: 128,
                                    height: 22,
                                    background: "grey",
                                },
                            }}
                        >
                            <Paper elevation={3} >Примеры</Paper>
                        </Box>
                        <div className={styles.task__examples}>
                            {
                                task?.examples.map(example =>
                                    <div key={example.id}>
                                        {example.text}
                                    </div>)
                            }
                        </div>

                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                '& > :not(style)': {
                                    m: 1,
                                    p: 1,
                                    width: 128,
                                    height: 22,
                                    background: "grey",
                                },
                            }}
                        >
                            <Paper elevation={3} >Примечание</Paper>
                        </Box>
                        <div className={styles.task__note}>
                            {
                                task?.note === "" || task?.note === undefined
                                    ?
                                    "К задаче нет примечаний"
                                    :
                                    task?.note
                            }
                        </div>
                    </div>

                    <div className={styles.task__code}>

                        <div className={styles.task__solution}>

                            <div className={styles.task__header}>
                                Решение
                            </div>

                            <div className={styles.task__editor}>
                                <Editor
                                    height="100%"
                                    width="100%"
                                    language={lang}
                                    value={code}
                                    onChange={handleEditorChange}
                                    theme="vs-dark" />
                            </div>

                            <div className={styles.task__controls}>
                                <Button
                                    variant="contained"
                                    onClick={handleCodePost}
                                >
                                    Run
                                </Button>
                            </div>

                        </div>

                        <div className={styles.task__result}>
                            {
                                result != undefined &&
                                <>
                                    {
                                        result?.status === 'success'
                                            ?
                                            <CheckCircleOutlineOutlinedIcon color="success" />
                                            :
                                            <ErrorOutlineOutlinedIcon sx={{ color: red[500] }} />

                                    }

                                    <div className={styles.task__error}>
                                        {result?.error}
                                    </div>

                                    <div className={styles.task__output}>
                                        {result?.output}
                                    </div>
                                </>
                            }


                        </div>

                    </div>

                </main>

                <footer className={styles.footer}>
                    <img src="./code.png" alt="" />
                </footer>

            </div>
        </>
    );
}

export default App;
