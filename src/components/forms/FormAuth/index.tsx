"use client";

import {useState, FC, useMemo, useEffect} from "react";
import {api} from "@/lib/axios";
import Swal from "sweetalert2";
import {Key, Mail, Visibility, VisibilityOff} from "@mui/icons-material";
import {
  StyledInput,
  StyledButtonSubmit,
  Title,
  StoreLogo,
  TextSecondary,
  Text,
} from "@/components";
import Link from "next/link";
import {
  RESPONSE_MESSAGE_INVALID_EMAIL_FORMAT,
  RESPONSE_MESSAGE_INVALID_PHONE_NUMBER,
} from "@/constants";
import {validateEmailFormat, validatePhoneNumber} from "@/utils";
import {useRouter} from "next/navigation";
import {signIn} from "next-auth/react";
import {IconButton, Stack} from "@mui/joy";
import {useRedirectIfAuthenticated} from "@/hooks";
import {Container, PasswordMeter} from "./components";

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
          text: "Selamat bergabung dengan Rumah Fashion! Anda sekarang bisa masuk untuk berbelanja.",
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
        router.push("/");
        Swal.fire({
          title: "Berhasil Masuk",
          text: "Selamat datang kembali di Rumah Fashion",
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
    <Container>
      <StoreLogo sx={{pr: 1.75}} />
      <Stack sx={{alignItems: "center"}}>
        <Title>Selamat datang</Title>
        <TextSecondary>
          {isSignUp ? "Buat Akun" : "Masuk"} untuk mulai berbelanja
        </TextSecondary>
      </Stack>
      <form onSubmit={onSubmitForm} className="w-full">
        <Stack spacing={2}>
          {isSignUp && (
            <StyledInput
              size="md"
              value={formData.name || ""}
              onChange={onChange}
              name="name"
              errorMessage={errorsForm.name}
              placeholder="Masukkan nama lengkap..."
              label="Nama Lengkap"
            />
          )}
          <StyledInput
            size="md"
            label="Alamat Email"
            value={formData.email}
            onChange={onChange}
            name="email"
            errorMessage={errorsForm.email}
            placeholder="Masukkan alamat email..."
            startDecorator={<Mail />}
          />
          <StyledInput
            size="md"
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
                size="md"
                label="Nomor Telepon"
                value={formData.phoneNumber || ""}
                onChange={onChange}
                name="phoneNumber"
                errorMessage={errorsForm.phoneNumber}
                placeholder="Masukkan nomor telepon..."
                startDecorator={<span>+62</span>}
              />
            </>
          )}
          <StyledButtonSubmit loading={loading} size="md">
            {isSignUp ? "BUAT AKUN" : "MASUK"}
          </StyledButtonSubmit>
          <Stack
            spacing={0.5}
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Text>{isSignUp ? "Sudah " : "Belum "}punya akun?</Text>
            <Link href={isSignUp ? "/sign-in" : "/sign-up"}>
              <Text sx={{textDecoration: "underline", color: "#d87234"}}>
                {isSignUp ? "Masuk" : "Buat Akun"}
              </Text>
            </Link>
          </Stack>
        </Stack>
      </form>
    </Container>
  );
};

export default FormAuthComponent;
