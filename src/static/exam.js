document.addEventListener('DOMContentLoaded', () => {
    // grab exam id
    let params = new URLSearchParams(document.location.search.substring());
    let id = params.get('examid');

    // set page title
    document.getElementById('title').innerHTML = `Exam ${id}`

    // set up table headers
    const examTable = document.getElementById('exam-table');
    const createTableHead = (table) => {
        let thead = table.createTHead();
        let row = thead.insertRow();
        let examHeaders = ['Student Name', 'Grade', 'Rank', 'Student ID'];
        for (let key of examHeaders) {
            let th = document.createElement('th');
            let text = document.createTextNode(key);
            th.appendChild(text);
            row.appendChild(th);
        }
    }
    createTableHead(examTable);

    const sortData = (data) => {
        // sort scores greatest to least
        let scores = [];
        data.forEach(entry => scores.push(entry.score))
        scores.sort((a, b) => b - a)
        // sort data to { 'studentName': 'Freda Terry', 'grade': '75%', 'rank': '7' }
        let sorted = [];
        for (let entry of data) {
            let sortedEntry = {};
            let entryArr = entry.studentId.match(/[a-zA-Z]+|[0-9]+/g)
            sortedEntry.StudentName = (isNaN(entryArr[1]) ? `${entryArr[0]} ${entryArr[1]}` : entryArr[0]);
            sortedEntry.grade = `${Math.round(entry.score * 100)}%`
            sortedEntry.rank = scores.indexOf(entry.score) + 1;
            sortedEntry.id = entry.studentId;
            sorted.push(sortedEntry)
        }
        populateTable(examTable, sorted)
    }

    const rowClickable = () => {
        let rows = examTable.getElementsByTagName('tr');
        for (i = 1; i < rows.length; i++) {
            let currentRow = examTable.rows[i];
            let createClickHandler = (row) => {
                return () => {
                    let nameCell = row.getElementsByTagName('td')[0];
                    let idCell = row.getElementsByTagName('td')[3];
                    let name = nameCell.innerHTML;
                    let id = idCell.innerHTML;
                    window.location.href = `/student.html?name=${name}&studentid=${id}`
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
        rowClickable();
    }

    // fetch single exam data
    fetch(`http://localhost:4000/api/v1/exams/${id}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('ave').innerHTML = `Average: ${Math.round(data.average * 100)}%`
            sortData(data.results)
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
