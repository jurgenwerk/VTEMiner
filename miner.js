class VteMiner {
  constructor(walletHash, concurrrency = 100, intensity = 16) {
    this.concurrrency = concurrrency;
    this.walletHash = walletHash;
    this.intensity = intensity;
    this.mineUrl = "https://www.volteuro.com/api/mine";
    this.queue = [];
  }

  startMining() {
    const timerId = setInterval(() => {
      if (this.queue.length < this.concurrrency) {
        const promise = this._mine();
        this.queue.push(promise);
        promise.finally(() => this.queue.pop());
      }
    }, 100);

    this.timerId = timerId;
  }

  stopMining() {
    if (!this.timerId) { return }
    clearInterval(this.timerId);
  }

  _mine() {
    const str = this._randomString();
    const strings = [...Array(this.intensity)].map(i => this._randomString(8));
    return fetch(this.mineUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({ strings: strings, wallet_hash: this.walletHash })
    });
  }

  _randomString(n) {
    return (new Array(n)).fill(0).map(() => Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 1)).join("")
  }
}
