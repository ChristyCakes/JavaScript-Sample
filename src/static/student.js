document.addEventListener('DOMContentLoaded', () => {
    // grab student name, id
    let params = new URLSearchParams(document.location.search.substring());
    let name = params.get('name')
    let id = params.get('studentid');

    // set page title
    document.getElementById('title').innerHTML = name;

    // set up table headers
    const studentTable = document.getElementById('student-table');
    const createTableHead = (table) => {
        let thead = table.createTHead();
        let row = thead.insertRow();
        let examHeaders = ['Exam ID', 'Grade'];
        for (let key of examHeaders) {
            let th = document.createElement('th');
            let text = document.createTextNode(key);
            th.appendChild(text);
            row.appendChild(th);
        }
    }
    createTableHead(studentTable);

    // 'Loading ...'
    const loadDiv = document.getElementById('loading');
    const setLoading = (display) => {
        loadDiv.style.display = display;
    }

    // Load More Button
    const loadMore = document.getElementById('load-more-grades')
    const setLoadMore = (display) => {
        loadMore.style.display = display;
    }
    loadMore.addEventListener('click', () => {
        setLoading('flex');
        setLoadMore('none');
        setTimeout(() => {
            location.reload();
            setLoading('none');
        }, 3000)
    })

    const sortData = (data) => {
        let examIds = Object.keys(data);
        let scores = Object.values(data).map(element => element.score)
        // sort data to { 'examId': 122, 'grade': '95%' }
        let sorted = [];
        for (let i = 0; i < examIds.length; i++) {
            let sortedEntry = {};
            sortedEntry.examId = examIds[i];
            sortedEntry.grade = `${Math.round(scores[i] * 100)}%`;
            sorted.push(sortedEntry);
        }
        // exam limit set in main.js line 92
        populateTable(studentTable, sorted.slice(0, 60));
        setLoading('none');
    }

    const rowClickable = () => {
        let rows = studentTable.getElementsByTagName('tr');
        for (i = 1; i < rows.length; i++) {
            let currentRow = studentTable.rows[i];
            let createClickHandler = (row) => {
                return () => {
                    let cell = row.getElementsByTagName('td')[0];
                    let id = cell.innerHTML;
                    window.location.href = `/exam.html?examid=${id}`;
                };
            };
            currentRow.onclick = createClickHandler(currentRow);
        }
    }

    const populateTable = (table, data) => {
        data.forEach(entry => {
            let row = table.insertRow();
            for (key in entry) {
                let cell = row.insertCell();
                let text = document.createTextNode(entry[key])
                cell.appendChild(text);
            }
        })
        // hide 'Load More'based on exam limit (see main.js line 92)
        if (studentTable.rows.length - 1 >= 60) { setLoadMore('none') }
        rowClickable();
    }

    // fetch student exam data
    fetch(`http://localhost:4000/api/v1/students/${id}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('ave').innerHTML = `Average Exam Score: ${Math.round(data.average * 100)}%`
            sortData(data.examResults)
        })

    // left panel buttons
    const studentsBtn = document.getElementById('students');
    studentsBtn.style.backgroundColor = 'transparent';
    studentsBtn.addEventListener('click', () => {
        window.location.href = '/students.html';
    })

    const examsBtn = document.getElementById('exams');
    examsBtn.style.backgroundColor = 'transparent';
    examsBtn.addEventListener('click', () => {
        window.location.href = '/index.html'
    })
})
