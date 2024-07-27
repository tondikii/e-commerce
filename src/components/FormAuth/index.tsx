"use client";

import {useState, FC, useMemo, useEffect} from "react";
import {api} from "@/lib/axios";
import Swal from "sweetalert2";
import {Key, Mail} from "@mui/icons-material";
import {StyledInput, Select, StyledTextarea, StyledButton} from "@/components";
import Link from "next/link";
import {CITY_OPTIONS, MAX_VARCHAR_LENGTH} from "@/constants";
import {CustomTargetType} from "@/types";

interface Props {
  type: "sign-up" | "sign-in";
}

type FormAuthType = {
  name?: string;
  email: string;
  password: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  postalCode?: string;
};

const initialFormSignIn: FormAuthType = {
  email: "",
  password: "",
};

const initialFormSignUp: FormAuthType = {
  ...initialFormSignIn,
  name: "",
  phoneNumber: "",
  address: "",
  city: "",
  postalCode: "",
};

const FormAuthComponent: FC<Props> = ({type}) => {
  const isSignUp: boolean = type === "sign-up";
  const usedInitialForm = isSignUp ? initialFormSignUp : initialFormSignIn;
  const [formData, setFormData] = useState<FormAuthType>(usedInitialForm);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const onChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const {name, value} = e.target;
    if (value?.length <= MAX_VARCHAR_LENGTH) {
      setFormData({...formData, [name]: value});
    }
  };

  const onChangeSelect = (target: CustomTargetType) => {
    const {name, value} = target;
    setFormData({...formData, [name]: value});
  };

  const {errorsForm, isValidForm} = useMemo(() => {
    const errorsForm: FormAuthType = {...usedInitialForm};
    let isValidForm: boolean = true;

    Object.keys(formData).forEach((key) => {
      const value = formData[key as keyof FormAuthType];
      if (!value) {
        isValidForm = false;
        if (submitted) {
          errorsForm[key as keyof FormAuthType] = "Data ini perlu diisi";
        }
      }
    });
    return {errorsForm, isValidForm};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, submitted]);

  const onSubmit = async () => {
    setSubmitted(true);
    if (!isValidForm) {
      return;
    }
    try {
      if (isSignUp) {
        await api.post("/user", formData);
        Swal.fire({
          title: "Berhasil Membuat Akun",
          text: "Akun anda berhasil dibuat, selamat bergabung dengan Belanja.co",
          icon: "success",
        });
      } else {
        await api.post("/login", formData);
        Swal.fire({
          title: "Berhasil Masuk",
          text: "Selamat datang kembali di Belanja.co",
          icon: "success",
        });
      }
    } catch (err: any) {
      Swal.fire({
        title: "Gagal",
        text: isSignUp ? "Gagal membuat akun" : "Gagal masuk",
        icon: "error",
      });
    }
  };

  const onSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  useEffect(() => {
    return () => {
      setFormData(usedInitialForm);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex justify-center items-center min-height-screen min-width-screen">
      <div className="flex flex-col justify-center items-center bg-secondary rounded-xl w-2/6 p-8 m-12">
        <h1 className="text-3xl font-montserrat font-bold mb-4">
          {isSignUp ? "BUAT AKUN" : "MASUK"}
        </h1>
        <form onSubmit={onSubmitForm} className="w-full">
          {isSignUp && (
            <StyledInput
              value={formData.name || ""}
              onChange={onChange}
              name="name"
              errorMessage={errorsForm.name}
              placeholder="Masukkan nama lengkap..."
              label="Nama Lengkap"
            />
          )}
          <StyledInput
            label="Alamat Email"
            value={formData.email}
            onChange={onChange}
            name="email"
            errorMessage={errorsForm.email}
            placeholder="Masukkan alamat email..."
            startDecorator={<Mail />}
          />
          <StyledInput
            label="Kata Sandi"
            value={formData.password}
            onChange={onChange}
            name="password"
            errorMessage={errorsForm.password}
            type="password"
            placeholder="Masukkan kata sandi..."
            startDecorator={<Key />}
          />
          {isSignUp && (
            <>
              <StyledInput
                label="Nomor Telepon"
                value={formData.phoneNumber || ""}
                onChange={onChange}
                name="phoneNumber"
                errorMessage={errorsForm.phoneNumber}
                placeholder="Masukkan nomor telepon..."
                startDecorator={<span>+62</span>}
              />
              <StyledTextarea
                label="Alamat"
                value={formData.address || ""}
                onChange={onChange}
                name="address"
                errorMessage={errorsForm.address}
                placeholder="Masukkan alamat..."
              />
              <Select
                label="Kota"
                options={CITY_OPTIONS}
                placeholder="Pilih kota"
                onChange={onChangeSelect}
                name="city"
                errorMessage={errorsForm.city}
              />
              <StyledInput
                label="Kode Pos"
                value={formData.postalCode || ""}
                onChange={onChange}
                name="postalCode"
                errorMessage={errorsForm.postalCode}
                placeholder="Masukkan kode pos..."
              />
            </>
          )}
          <StyledButton type="submit">
            {isSignUp ? "BUAT AKUN" : "MASUK"}
          </StyledButton>
          {isSignUp ? (
            <div className="mt-4 block text-center">
              <span>Sudah punya akun?</span>
              <Link
                className="underline text-tertiary font-medium ml-1"
                href="/sign-in"
              >
                Masuk
              </Link>
            </div>
          ) : (
            <div className="mt-4 block text-center">
              <span>Belum punya akun?</span>
              <Link
                className="underline text-tertiary font-medium ml-1"
                href="/sign-up"
              >
                Buat Akun
              </Link>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default FormAuthComponent;
