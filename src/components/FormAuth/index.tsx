"use client";

import {useState, FC, useMemo, useEffect} from "react";
import {api} from "@/lib/axios";
import Swal from "sweetalert2";
import {Key, Mail, Visibility, VisibilityOff} from "@mui/icons-material";
import {
  StyledInput,
  Select,
  StyledTextarea,
  StyledButton,
  PasswordMeter,
} from "@/components";
import Link from "next/link";
import {
  CITY_OPTIONS,
  MAX_VARCHAR_LENGTH,
  RESPONSE_MESSAGE_INVALID_EMAIL_FORMAT,
  RESPONSE_MESSAGE_INVALID_PHONE_NUMBER,
} from "@/constants";
import {CustomTargetType} from "@/types";
import {validateEmailFormat, validatePhoneNumber} from "@/utils";
import {useRouter} from "next/navigation";
import {signIn} from "next-auth/react";
import {IconButton} from "@mui/joy";
import {useRedirectIfAuthenticated} from "@/hooks";

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
  const router = useRouter();

  // direct to home if have session
  useRedirectIfAuthenticated();

  const isSignUp: boolean = type === "sign-up";
  const usedInitialForm = isSignUp ? initialFormSignUp : initialFormSignIn;
  const [formData, setFormData] = useState<FormAuthType>(usedInitialForm);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isStrongPassword, setIsStrongPassword] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const phonNumberWithCode: string = `+62${formData?.phoneNumber}`;

  const onChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const {name, value} = e.target;
      setFormData({...formData, [name]: value});
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
      } else if (key === "email") {
        const isValidEmailFormat = validateEmailFormat(formData.email);
        if (!isValidEmailFormat) {
          errorsForm.email = RESPONSE_MESSAGE_INVALID_EMAIL_FORMAT;
          isValidForm = false;
        }
      } else if (key === "phoneNumber") {
        const isValidPhoneNumber = validatePhoneNumber(phonNumberWithCode);
        if (!isValidPhoneNumber) {
          errorsForm.phoneNumber = RESPONSE_MESSAGE_INVALID_PHONE_NUMBER;
          isValidForm = false;
        }
      }
    });

    return {errorsForm, isValidForm};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, submitted]);

  const onSubmitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    if (!isValidForm || (isSignUp && !isStrongPassword)) {
      return;
    }
    try {
      setLoading(true);
      if (isSignUp) {
        await api.post("/user", {...formData, phoneNumber: phonNumberWithCode});
        router.push("/sign-in");
        Swal.fire({
          title: "Berhasil Membuat Akun",
          text: "Selamat bergabung dengan TokoTrend! Anda sekarang bisa masuk untuk berbelanja.",
          icon: "success",
        });
      } else {
        const signInData = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });
        if (signInData?.error) {
          throw new Error(signInData.error);
        }
        router.push("/cart");
        Swal.fire({
          title: "Berhasil Masuk",
          text: "Selamat datang kembali di TokoTrend",
          icon: "success",
        });
      }
    } catch (err: any) {
      let message: string = err?.message || "Terjadi kesalahan tidak diketahui";
      if (err?.name === "AxiosError") {
        const errMessage = err?.response?.data?.message || "";
        if (errMessage) {
          message = errMessage;
        }
      }
      Swal.fire({
        title: `Gagal ${isSignUp ? "Membuat Akun" : "Masuk"}`,
        text: message,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const renderVisibilityPassword = () => {
    const sx = {color: "#626b74"};
    return (
      <IconButton onClick={toggleShowPassword}>
        {showPassword ? <Visibility sx={sx} /> : <VisibilityOff sx={sx} />}
      </IconButton>
    );
  };

  useEffect(() => {
    return () => {
      setFormData(usedInitialForm);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center items-center p-8 w-2/3">
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
            type={showPassword ? "text" : "password"}
            placeholder="Masukkan kata sandi..."
            startDecorator={<Key />}
            endDecorator={renderVisibilityPassword()}
          />

          {isSignUp && (
            <>
              <PasswordMeter
                password={formData?.password}
                setIsStrong={setIsStrongPassword}
              />
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
                maxLength={5}
              />
            </>
          )}
          <StyledButton type="submit" loading={loading}>
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
