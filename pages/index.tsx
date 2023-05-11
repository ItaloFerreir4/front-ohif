import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import { Config } from './config';
import { isValid } from 'date-fns';

type Row = {
  id: number;
  patientName: string;
  patientId: string;
  accession: string;
  studyDate: string;
  modality: string;
  studyDescription: string;
};

const StudyTable = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [valueName, setValueName] = useState('');
  const [valueDescription, setValueDescription] = useState('');
  const [valueDateInitial, setValueDateInitial] = useState('');
  const [valueDateFinish, setValueDateFinish] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      const query = `${Config.hostname}:${Config.port}/${Config.qido}/studies?includefield=00081030%2C00080060%2C00080020&PatientName=${valueName}&StudyDescription=${valueDescription}${valueDateInitial == '' || valueDateFinish == ''? '': `&StudyDate=${dateQuery(valueDateInitial)}-${dateQuery(valueDateFinish)}`}`;
      const options = { signal: controller.signal };

      try {
        const response = await fetch(query, options);
        const data = await response.json();
        const rows = data.map((row: any, index: any) => {
          return {
            id: get(row, '0020000D.Value[0]', ''),
            patientName: get(row, '00100010.Value[0].Alphabetic', 'no name'),
            patientId: get(row, '00100020.Value[0]', 'no id'),
            accession: get(row, '00080050.Value[0]', ''),
            studyDate: get(row, '00080020.Value[0]', ''),
            modality: get(row, '00080061.Value[0]', ''),
            studyDescription: get(row, '00081030.Value[0]', ''),
          };
        });
        setRows(rows);

      } catch (error) {
        console.error(error);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [valueName, valueDescription, valueDateInitial, valueDateFinish]);

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValueName(e.target.value);
  };

  const handleChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValueDescription(e.target.value);
  };

  const handleChangeDateInitial = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValueDateInitial(e.target.value);
  };

  const handleChangeDateFinish = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValueDateFinish(e.target.value);
  };

  const clearInputDate = () => {
    setValueDateInitial('');
    setValueDateFinish('');
  }

  return (
    <div className="content">
      <div className="header">
        <h1>Lista de estudos</h1>
        <span id="contStudy">{rows.length}</span>
      </div>
      <div className="table-head-background"></div>
      <div className="study-list-header-mobile">
        <label>Nome do Paciente</label>
        <input type="text" value={valueName} onChange={handleChangeName} />
      </div>
      <table className="study-list">
        <thead className="study-list-header">
          <tr className="study-list-header-desktop">
            <th>
              <label>Nome do Paciente / MRN</label>
              <input type="text" value={valueName} onChange={handleChangeName} />
            </th>
            <th>
              <label>Descrição</label>
              <input type="text" value={valueDescription} onChange={handleChangeDescription} />
            </th>
            <th>
              <label>Data do Estudo</label>
              <div className="date-range">
                <div className="date-div-input">
                  <input className="date-input" aria-label="Data Inicial" placeholder="Data Inicial" type="date" value={valueDateInitial} onChange={handleChangeDateInitial} />
                </div>
                <div>
                  <svg className="date-arrow" focusable="false" viewBox="0 0 1000 1000"><path d="M694 242l249 250c12 11 12 21 1 32L694 773c-5 5-10 7-16 7s-11-2-16-7c-11-11-11-21 0-32l210-210H68c-13 0-23-10-23-23s10-23 23-23h806L662 275c-21-22 11-54 32-33z"></path></svg>
                </div>
                <div className="date-div-input">
                  <input className="date-input" aria-label="Data Final" placeholder="Data Final" type="date" value={valueDateFinish} onChange={handleChangeDateFinish} />
                </div>
                <div onClick={clearInputDate}>
                  <svg className="date-clear" focusable="false" viewBox="0 0 12 12"><path fillRule="evenodd" d="M11.53.47a.75.75 0 0 0-1.061 0l-4.47 4.47L1.529.47A.75.75 0 1 0 .468 1.531l4.47 4.47-4.47 4.47a.75.75 0 1 0 1.061 1.061l4.47-4.47 4.47 4.47a.75.75 0 1 0 1.061-1.061l-4.47-4.47 4.47-4.47a.75.75 0 0 0 0-1.061z"></path></svg>
                </div>
              </div>              
            </th>
          </tr>
        </thead>
        <tbody className="study-list-body">
          {rows.map((row) => (
            <tr key={row.id} onClick={() => redirectPage(row.id)}>
              <td>
                <div>
                  {row.patientName}
                </div>
                <div className="patient-id">
                  {row.patientId}
                </div>
              </td>
              <td style={{textAlign: "right"}}>{row.modality}</td>
              <td style={{textAlign: "center"}}>{formatDate(row.studyDate)}</td>              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudyTable;

function redirectPage(id : any) {
  // redireciona para a página desejada usando o id
  window.location.href = `http://localhost:5001/viewer/${id}`;
}

function dateQuery(date: any){
  return date.replaceAll('-', '');
}

function formatDate(dateString: string): string {
  const year = dateString.slice(0, 4);
  const month = dateString.slice(4, 6);
  const day = dateString.slice(6, 8);

  const months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  const date = new Date(`${year}-${month}-${day}`);
  const dateFormat = `${months[Number(month) - 1]} ${Number(day)}, ${year}`;

  return isValid(date) ? dateFormat : 'Data inválida';
}
