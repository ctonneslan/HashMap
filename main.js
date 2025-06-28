class HashMap {
  constructor(initialCapacity = 8, loadFactor = 0.75) {
    this.capacity = initialCapacity;
    this.loadFactor = loadFactor;
    this.buckets = Array.from({ length: this.capacity }, () => []);
    this.count = 0;
  }

  hash(key) {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash << 5) - hash + key.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash) % this.capacity;
  }

  set(key, value) {
    const index = this.hash(key);
    const bucket = this.buckets[index];

    const found = bucket.find((entry) => entry[0] === key);
    if (found) {
      found[1] = value;
    } else {
      bucket.push([key, value]);
      this.count++;

      if (this.count / this.capacity > this.loadFactor) {
        this.grow();
      }
    }
  }

  get(key) {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    const entry = bucket.find(([k]) => k === key);
    return entry ? entry[1] : null;
  }

  has(key) {
    return this.get(key) !== null;
  }

  remove(key) {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    const entryIndex = bucket.findIndex(([k]) => k === key);
    if (entryIndex !== -1) {
      bucket.splice(entryIndex, 1);
      this.count--;
      return true;
    }
    return false;
  }

  length() {
    return this.count;
  }

  clear() {
    this.buckets = Array.from({ length: this.capacity }, () => []);
    this.count = 0;
  }

  keys() {
    return this.buckets.flat().map(([k]) => k);
  }

  values() {
    return this.buckets.flat().map(([, v]) => v);
  }

  entries() {
    return this.buckets.flat();
  }

  grow() {
    const oldEntries = this.entries();
    this.capacity *= 2;
    this.buckets = Array.from({ length: this.capacity }, () => []);
    this.count = 0;

    for (const [key, value] of oldEntries) {
      this.set(key, value);
    }
  }
}

const map = new HashMap();
const bucketsDiv = document.getElementById("buckets");

function updateDisplay() {
  bucketsDiv.innerHTML = "";
  map.buckets.forEach((bucket, i) => {
    const div = document.createElement("div");
    div.classList.add("bucket");
    div.innerHTML = `<strong>Index ${i}</strong>`;
    bucket.forEach(([k, v]) => {
      const pair = document.createElement("div");
      pair.classList.add("pair");
      pair.textContent = `${k}: ${v}`;
      div.appendChild(pair);
    });
    bucketsDiv.appendChild(div);
  });
}

function insertEntry() {
  const key = document.getElementById("key").value;
  const value = document.getElementById("value").value;
  if (!key || !value) return;
  map.set(key, value);
  updateDisplay();
}

function removeEntry() {
  const key = document.getElementById("key").value;
  if (!key) return;
  map.remove(key);
  updateDisplay();
}

function clearMap() {
  map.clear();
  updateDisplay();
}
