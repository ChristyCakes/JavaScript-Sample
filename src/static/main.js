document.addEventListener('DOMContentLoaded', () => {
    // set up table headers
    const allExamsTable = document.getElementById('all-exams-table');
    const createTableHead = (table) => {
        let thead = table.createTHead();
        let row = thead.insertRow();
        let examHeaders = ['Exam ID', 'Avg Exam Grade', 'Students'];
        for (let key of examHeaders) {
            let th = document.createElement('th');
            let text = document.createTextNode(key);
            th.appendChild(text);
            row.appendChild(th);
        }
    }
    createTableHead(allExamsTable);

    // populate table
    const populateTable = (table, data) => {
        for (let element of data) {
            // element === { id: 4833, studentCount: 20, average: 0.7515... }
            let row = table.insertRow();
            for (key in element) {
                let text;
                let cell;
                if (key === 'id' || key === 'studentCount') {
                    cell = row.insertCell();
                    text = document.createTextNode(element[key]);
                } else {
                    cell = row.insertCell(1);
                    percent = Math.round(element[key] * 100);
                    text = document.createTextNode(`${percent}%`);
                }
                cell.appendChild(text);
            }
        }
    }

    // nav to single exam page on row click
    const rowClickable = () => {
        let rows = allExamsTable.getElementsByTagName('tr');
        for (i = 1; i < rows.length; i++) {
            let currentRow = allExamsTable.rows[i];
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

    // 'Loading ...'
    const loadDiv = document.getElementById('loading');
    const setLoading = (display) => {
        loadDiv.style.display = display;
    }

    // 'Load More'
    const loadMore = document.getElementById('load-more')
    const setLoadMore = (display) => {
        loadMore.style.display = display;
    }
    loadMore.addEventListener('click', () => {
        rowLimit += 20;
        setLoading('inline');
        setLoadMore('none');
        openConnection();
    })

    getTableLength = () => {
        return allExamsTable.rows.length - 1        // don't count header row
    }

    renderData = () => {
        // fill rows
        populateTable(allExamsTable, exams.slice(getTableLength(), exams.length + 1));

        // remove 'Loading...' when rowLimit met
        (getTableLength() >= rowLimit ? (setLoading('none'),
            // and show 'Load More' if examLimit not met
            (exams.length < examLimit ? setLoadMore('flex') : setLoadMore('none')))
            :
            setLoading('flex')
        );
        rowClickable();
    }

    // fetch exam data
    let exams = [];
    let examLimit = 60;     // storage limit; adjust as needed
    let rowLimit = 20;      // render batch limit
    const evtSource = new EventSource('http://localhost:4000/api/v1/exams');
    const openConnection = () => {
        evtSource.onmessage = (e) => {
            let parsed = JSON.parse(e.data);
            if (parsed.exams.length > 1) {
                exams = parsed.exams.slice(0, examLimit);
                if (getTableLength() < rowLimit) renderData()
            }

            if (exams.length >= examLimit) {
                console.log('exams array full, closing event source');
                evtSource.close();
                setLoading('none');
            }
        }
    }
    openConnection();

    // left panel button
    const studentsBtn = document.getElementById('students');
    studentsBtn.style.backgroundColor = 'transparent';
    studentsBtn.addEventListener('click', () => {
        window.location.href = '/students.html';
    })
})
