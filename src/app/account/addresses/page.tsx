// src/app/account/addresses/page.tsx
"use client";

import {useState, useEffect} from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Sheet,
  Modal,
  ModalDialog,
  ModalClose,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Stack,
  Alert,
  Divider,
} from "@mui/joy";
import {
  AddRounded,
  EditRounded,
  DeleteRounded,
  HomeRounded,
} from "@mui/icons-material";
import Link from "next/link";
import {useAddresses} from "@/hooks/useAddresses";
import {PageLoader} from "@/components";

const AddressesPage = () => {
  const {
    loading,
    error,
    getAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
  } = useAddresses();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [formData, setFormData] = useState({
    recipient: "",
    phone: "",
    address: "",
    province: "",
    city: "",
    postalCode: "",
  });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    loadAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAddresses = async () => {
    try {
      const data = await getAddresses();
      setAddresses(data);
    } catch (err) {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Validasi
    if (
      !formData.recipient ||
      !formData.phone ||
      !formData.address ||
      !formData.province ||
      !formData.city ||
      !formData.postalCode
    ) {
      setFormError("Semua field harus diisi");
      return;
    }

    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, formData);
      } else {
        await createAddress(formData);
      }

      setShowForm(false);
      setEditingAddress(null);
      setFormData({
        recipient: "",
        phone: "",
        address: "",
        province: "",
        city: "",
        postalCode: "",
      });
      await loadAddresses();
    } catch (err) {}
  };

  const handleEdit = (address: any) => {
    setEditingAddress(address);
    setFormData({
      recipient: address.recipient,
      phone: address.phone,
      address: address.address,
      province: address.province,
      city: address.city,
      postalCode: address.postalCode,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus alamat ini?")) {
      try {
        await deleteAddress(id);
        await loadAddresses();
      } catch (err) {}
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAddress(null);
    setFormData({
      recipient: "",
      phone: "",
      address: "",
      province: "",
      city: "",
      postalCode: "",
    });
  };

  if (loading && addresses.length === 0) {
    return <PageLoader />;
  }

  return (
    <Container maxWidth="md" sx={{py: 4}}>
      {/* Header */}
      <Box sx={{display: "flex", alignItems: "center", mb: 4, gap: 2}}>
        <Typography level="h2" sx={{flex: 1, fontWeight: 700}}>
          Alamat Pengiriman
        </Typography>
        <Button
          startDecorator={<AddRounded />}
          onClick={() => setShowForm(true)}
          color="neutral"
        >
          Tambah Alamat
        </Button>
      </Box>

      {error && (
        <Alert color="danger" sx={{mb: 3}}>
          {error}
        </Alert>
      )}

      {/* Address List */}
      <Stack spacing={3}>
        {addresses.map((address) => (
          <Sheet
            key={address.id}
            variant="outlined"
            sx={{p: 3, borderRadius: "lg"}}
          >
            <Box sx={{display: "flex", alignItems: "flex-start", gap: 2}}>
              <HomeRounded sx={{fontSize: 24, color: "neutral.500", mt: 0.5}} />
              <Box sx={{flex: 1}}>
                <Typography level="title-md" fontWeight={600} sx={{mb: 1}}>
                  {address.recipient}
                </Typography>
                <Typography level="body-sm" sx={{mb: 1}}>
                  {address.phone}
                </Typography>
                <Typography level="body-sm" color="neutral" sx={{mb: 2}}>
                  {address.address}, {address.city}, {address.province}{" "}
                  {address.postalCode}
                </Typography>
                <Box sx={{display: "flex", gap: 1}}>
                  <Button
                    variant="outlined"
                    size="sm"
                    startDecorator={<EditRounded />}
                    onClick={() => handleEdit(address)}
                    color="warning"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="danger"
                    size="sm"
                    startDecorator={<DeleteRounded />}
                    onClick={() => handleDelete(address.id)}
                  >
                    Hapus
                  </Button>
                </Box>
              </Box>
            </Box>
          </Sheet>
        ))}

        {addresses.length === 0 && (
          <Sheet
            variant="outlined"
            sx={{p: 4, borderRadius: "lg", textAlign: "center"}}
          >
            <HomeRounded sx={{fontSize: 48, color: "neutral.400", mb: 2}} />
            <Typography level="h4" sx={{mb: 1}}>
              Belum ada alamat
            </Typography>
            <Typography level="body-md" color="neutral" sx={{mb: 3}}>
              Tambahkan alamat pengiriman untuk memudahkan proses checkout
            </Typography>
            <Button
              startDecorator={<AddRounded />}
              onClick={() => setShowForm(true)}
            >
              Tambah Alamat Pertama
            </Button>
          </Sheet>
        )}
      </Stack>

      {/* Add/Edit Address Modal */}
      <Modal open={showForm} onClose={handleCloseForm}>
        <ModalDialog sx={{maxWidth: 500, width: "100%"}}>
          <ModalClose />
          <Typography level="h4" sx={{mb: 2}}>
            {editingAddress ? "Edit Alamat" : "Tambah Alamat Baru"}
          </Typography>

          {formError && (
            <Alert color="danger" sx={{mb: 2}}>
              {formError}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Nama Penerima</FormLabel>
                <Input
                  value={formData.recipient}
                  onChange={(e) =>
                    setFormData({...formData, recipient: e.target.value})
                  }
                  placeholder="Nama lengkap penerima"
                  required
                />
              </FormControl>

              <FormControl>
                <FormLabel>Nomor Telepon</FormLabel>
                <Input
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({...formData, phone: e.target.value})
                  }
                  placeholder="Contoh: 081234567890"
                  required
                />
              </FormControl>

              <FormControl>
                <FormLabel>Alamat Lengkap</FormLabel>
                <Textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({...formData, address: e.target.value})
                  }
                  placeholder="Nama jalan, nomor rumah, nama gedung, dll."
                  minRows={2}
                  required
                />
              </FormControl>

              <Box
                sx={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2}}
              >
                <FormControl>
                  <FormLabel>Provinsi</FormLabel>
                  <Input
                    value={formData.province}
                    onChange={(e) =>
                      setFormData({...formData, province: e.target.value})
                    }
                    placeholder="Contoh: Jawa Barat"
                    required
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Kota</FormLabel>
                  <Input
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({...formData, city: e.target.value})
                    }
                    placeholder="Contoh: Bandung"
                    required
                  />
                </FormControl>
              </Box>

              <FormControl sx={{maxWidth: 200}}>
                <FormLabel>Kode Pos</FormLabel>
                <Input
                  value={formData.postalCode}
                  onChange={(e) =>
                    setFormData({...formData, postalCode: e.target.value})
                  }
                  placeholder="Contoh: 40125"
                  required
                />
              </FormControl>

              <Divider sx={{my: 1}} />

              <Box sx={{display: "flex", gap: 1, justifyContent: "flex-end"}}>
                <Button variant="outlined" onClick={handleCloseForm}>
                  Batal
                </Button>
                <Button type="submit">
                  {editingAddress ? "Update Alamat" : "Tambah Alamat"}
                </Button>
              </Box>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </Container>
  );
};

export default AddressesPage;
