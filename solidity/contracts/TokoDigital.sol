// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TokoDigital {
    address public pemilik;
    uint256 public produkIdBerikutnya;

    struct Produk {
        uint256 id;
        string nama;
        uint256 harga;
        string deskripsi;
        bool aktif;
        string gambar;
    }

    struct Pembelian {
        uint256 produkId;
        uint256 timestamp;
    }

    mapping(uint256 => Produk) public produk;
    mapping(address => mapping(uint256 => bool)) public statusBeli;
    mapping(address => Pembelian[]) public riwayatPembelian;

    event ProdukDitambahkan(uint256 id, string nama, uint256 harga, string deskripsi, string gambar);
    event ProdukDiupdate(uint256 id, string nama, uint256 harga, string deskripsi, bool aktif, string gambar);
    event ProdukDibeli(address pembeli, uint256 produkId, uint256 harga);
    event DanaDitarik(address pemilik, uint256 jumlah);
    event KontrakDireset(address pemilik, uint256 jumlahProduk);

    modifier hanyaPemilik() {
        require(msg.sender == pemilik, "Hanya pemilik yang bisa melakukan ini");
        _;
    }

    constructor() {
        pemilik = msg.sender;
        produkIdBerikutnya = 1;
    }

    function tambahProduk(string memory _nama, uint256 _harga, string memory _deskripsi, string memory _gambar) public hanyaPemilik {
        require(bytes(_nama).length > 0, "Nama tidak boleh kosong");
        require(_harga > 0, "Harga harus lebih dari 0");
        require(bytes(_deskripsi).length > 0, "Deskripsi tidak boleh kosong");

        produk[produkIdBerikutnya] = Produk(produkIdBerikutnya, _nama, _harga, _deskripsi, true, _gambar);
        emit ProdukDitambahkan(produkIdBerikutnya, _nama, _harga, _deskripsi, _gambar);
        produkIdBerikutnya++;
    }

    function updateProduk(uint256 _id, string memory _nama, uint256 _harga, string memory _deskripsi, bool _aktif, string memory _gambar) public hanyaPemilik {
        require(produk[_id].id != 0, "Produk tidak ditemukan");
        require(bytes(_nama).length > 0, "Nama tidak boleh kosong");
        require(_harga > 0, "Harga harus lebih dari 0");
        require(bytes(_deskripsi).length > 0, "Deskripsi tidak boleh kosong");

        produk[_id] = Produk(_id, _nama, _harga, _deskripsi, _aktif, _gambar);
        emit ProdukDiupdate(_id, _nama, _harga, _deskripsi, _aktif, _gambar);
    }

    function beliProduk(uint256 _id) public payable {
        require(produk[_id].id != 0, "Produk tidak ditemukan");
        require(produk[_id].aktif, "Produk tidak aktif");
        require(msg.value >= produk[_id].harga, "Ether tidak cukup");
        require(!statusBeli[msg.sender][_id], "Produk sudah dibeli");

        statusBeli[msg.sender][_id] = true;
        riwayatPembelian[msg.sender].push(Pembelian(_id, block.timestamp));

        if (msg.value > produk[_id].harga) {
            payable(msg.sender).transfer(msg.value - produk[_id].harga);
        }

        emit ProdukDibeli(msg.sender, _id, produk[_id].harga);
    }

    function resetContract(Produk[] memory _seededProduk) public hanyaPemilik {
        // Clear purchase history for all users
        for (uint256 i = 1; i < produkIdBerikutnya; i++) {
            if (produk[i].id != 0) {
                for (uint256 j = 0; j < riwayatPembelian[pemilik].length; j++) {
                    delete statusBeli[pemilik][riwayatPembelian[pemilik][j].produkId];
                }
                delete riwayatPembelian[pemilik];
            }
        }

        // Delete all existing products
        for (uint256 i = 1; i < produkIdBerikutnya; i++) {
            delete produk[i];
        }

        // Restore seeded products
        for (uint256 i = 0; i < _seededProduk.length; i++) {
            Produk memory p = _seededProduk[i];
            require(p.id > 0 && p.id <= _seededProduk.length, "ID produk tidak valid");
            require(bytes(p.nama).length > 0, "Nama seeder tidak boleh kosong.");
            require(p.harga > 0, "Harga seeder harus lebih dari 0");
            require(bytes(p.deskripsi).length > 0, "Deskripsi seeder tidak boleh kosong");

            produk[p.id] = Produk(p.id, p.nama, p.harga, p.deskripsi, true, p.gambar);
        }

        // Update produkIdBerikutnya to next available ID
        produkIdBerikutnya = _seededProduk.length + 1;

        emit KontrakDireset(pemilik, _seededProduk.length);
    }

    function getSemuaProduk() public view returns (Produk[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i < produkIdBerikutnya; i++) {
            if (produk[i].id != 0) {
                count++;
            }
        }

        Produk[] memory semuaProduk = new Produk[](count);
        uint256 index = 0;
        for (uint256 i = 1; i < produkIdBerikutnya; i++) {
            if (produk[i].id != 0) {
                semuaProduk[index] = produk[i];
                index++;
            }
        }
        return semuaProduk;
    }

    function cekStatusBeli(address _pembeli, uint256 _id) public view returns (bool) {
        return statusBeli[_pembeli][_id];
    }

    function getRiwayatPembelian(address _pembeli) public view returns (Pembelian[] memory) {
        return riwayatPembelian[_pembeli];
    }

    function getPemilik() public view returns (address) {
        return pemilik;
    }

    function getSaldoKontrak() public view hanyaPemilik returns (uint256) {
        return address(this).balance;
    }

    function tarikDana() public hanyaPemilik {
        uint256 saldo = address(this).balance;
        require(saldo > 0, "Tidak ada dana untuk ditarik");
        payable(pemilik).transfer(saldo);
        emit DanaDitarik(pemilik, saldo);
    }
}