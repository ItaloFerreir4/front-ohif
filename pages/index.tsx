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
  const [value, setValue] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      const query = `${Config.hostname}:${Config.port}/${Config.qido}/studies?includefield=00081030%2C00080060%2C00080020&PatientName=${value}`;
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
  }, [value]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Call fetchData again with new value
    fetchData();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className="content">
      <div className="header">
        <h1>Lista de estudos</h1>
        <span id="contStudy">{rows.length}</span>
      </div>
      <div className="table-head-background"></div>
      <table className="study-list">
        <thead className="study-list-header">
          <tr>
            <th>
              <label>Nome do paciente / MRN</label>
              <input type="text" value={value} onChange={handleChange} />
            </th>
            <th>
              <label>Descrição</label>
              <input type="text" value={value} onChange={handleChange} />
            </th>
            <th>
              <label>Data do estudo</label>
              <input type="text" value={value} onChange={handleChange} />
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

function fetchData() {
  throw new Error('Function not implemented.');
}

function redirectPage(id : any) {
  // redireciona para a página desejada usando o id
  window.location.href = `http://localhost:5001/viewer/${id}`;
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
