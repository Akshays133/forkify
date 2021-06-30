import axios from 'axios';
import { key, proxy  } from '../config';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        
        try {
            const res = await axios(`${proxy}?q=${this.query}`);
            // console.log(res);
            this.result = res.data.recipes;
            // console.log(this.result);
        } catch(error) {
            alert(error);
        }
    }
}