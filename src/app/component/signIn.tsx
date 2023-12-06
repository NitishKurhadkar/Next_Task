"use client";
import { useState, useEffect, Fragment } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useForm } from "react-hook-form";
import CircularProgress from "@mui/material/CircularProgress";
import FormHelperText from "@mui/material/FormHelperText";
import data from "./../../../public/data.json";

const defaultTheme = createTheme();

export default function SignIn() {
  const [formData, setFormData] = useState<any []>([]);

  useEffect(() => {
    const cacheData = localStorage.getItem("data");
    if (!cacheData) localStorage.setItem("data", JSON.stringify(data.data));
    setFormData(cacheData ? JSON.parse(cacheData) : data.data);
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  console.log(errors, "errors")

  const onSubmit = (inputData: Object) => console.log(inputData)
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        : <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {!formData[0] ? <CircularProgress />
            :
            <Fragment>
              <Typography component="h1" variant="h5">
                Sign in
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                sx={{ mt: 1 }}
              >
                {formData?.map((item: any) => {
                  const errorMsg : any = errors[item.name]?.message;
                  const fieldName = item.name.toLowerCase();
                  const pattern: any = fieldName == "email" ? {
                    value: /\S+@\S+\.\S+/,
                    message: "Entered value does not match email format",
                  } : null;

                  return (["LIST", "RADIO"].includes(item.fieldType) ?
                    <Fragment key={item.id}>
                      <InputLabel id="listlabel">{item.name}</InputLabel>
                      <Select
                        key={item.id}
                        labelId="listlabel"
                        defaultValue={item.defaultValue}
                        label={item.name}
                        required={item.required}
                        {...register(item.name, {
                          required: item.required ? `${item.name} is required` : false
                        })}
                        error={!!errors[item.name]}
                      >
                        {item.listOfValues1?.map((_item: String, index: number) => (
                          <MenuItem key={index+1000} value={index + 1}>
                            {_item}
                          </MenuItem>
                        ))}
                      </Select>
                      {errorMsg && <FormHelperText>{errorMsg}</FormHelperText>}
                    </Fragment>
                    :
                    <TextField
                      className={item.fieldType}
                      key={item.id}
                      margin="normal"
                      fullWidth
                      label={item.name}
                      autoFocus
                      type={item.fieldType.toLowerCase()}
                      defaultValue={item.defaultValue}
                      required
                      {...register(item.name, {
                        required: item.required ? `${item.name} is required` : false,
                        minLength: item.minLength,
                        maxLength: item.maxLength,
                        pattern : pattern,
                      })}
                      error={!!errors[item.name]}
                      helperText={errorMsg ? errorMsg : errors[item.name]?.type == "minLength" ? `Minimum ${item.minLength} character is required` : errors[item.name]?.type == "maxLength" ? `Maximum ${item.maxLength} character` : false}
                    />
                  )
                })
                }

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </Button>
              </Box>
            </Fragment>
          }
        </Box>
      </Container>
    </ThemeProvider>
  );
}