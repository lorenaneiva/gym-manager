// src/services/api.js
import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:3000' // Porta onde o json-server roda
})
