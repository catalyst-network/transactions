<template>
  <v-app>
    <v-content>
      <v-container>
        <v-row class="flex justify-center text-center">
          <v-col cols="12">
            <v-text-field v-model="to" label="To" filled></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field v-model="value" label="Amount" filled></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-text-field v-model="gasPrice" label="Gas Price" filled></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-text-field v-model="gasLimit" label="Gas Limit" filled></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field v-model="transactionsNo" label="Number of transactions to construct" filled></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-btn depressed small color="primary" @click="sendRawTransaction">Send Transaction</v-btn>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-btn depressed small color="primary" @click="spamTransactions">Spam Transactions</v-btn>
          </v-col>
          <v-col cols="12">
            <v-btn text small color="primary" @click="clear">Clear</v-btn>
          </v-col>
          <v-col v-if="result" cols="12">Transaction: {{ result }}</v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { sendRawTransaction } from "./transactions";
import { spamTransactions } from "./transactions";

export default {
  name: "App",

  data: () => ({
    to: "0x91470b2c2ab22f6eccf7b347138a43c781b8b831",
    value: 0.1,
    gasPrice: 5,
    gasLimit: 21004,
    transactionsNo: 100,
    result: null,
  }),

  methods: {
    clear() {
      this.to = null;
      this.value = null;
      this.gasPrice = null;
      this.gasLimit = null;
      this.transactionsNo = null;
      this.result = null;
    },

    // async sendTransaction() {
    //   this.result = await sendTransaction(this.to, this.value, this.gasPrice, this.gasLimit);
    //   console.log('result: ',this.result);
    // },

    async sendRawTransaction() {
      this.result = await sendRawTransaction(
        this.to,
        this.value,
        this.gasPrice,
        this.gasLimit
      );
      console.log('result: ', this.result)
    },
    async spamTransactions() {
      this.result = await spamTransactions(this.transactionsNo);
      console.log('result: ', this.result);
    }
  },
};
</script>
