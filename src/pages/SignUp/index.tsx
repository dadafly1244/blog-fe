import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRegister, RegisterCredentials } from "@/hook/registerApi";

const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const register = useRegister();

  const [formData, setFormData] = useState<RegisterCredentials>({
    user: "",
    pwd: "",
    roles: "User",
    status: "active",
    profile: {
      avatar: "",
      firstName: "",
      lastName: "",
      gender: "prefer not to say",
      birthDate: "",
      bio: "",
      location: "",
      website: "",
      socialLinks: {
        facebook: "",
        twitter: "",
        instagram: "",
        linkedin: "",
      },
    },
  });

  const [validUsername, setValidUsername] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    setValidUsername(USER_REGEX.test(formData.user));
  }, [formData.user]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(formData.pwd));
  }, [formData.pwd]);

  useEffect(() => {
    setErrMsg("");
  }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const keys = name.split(".");
      setFormData((prev) => {
        let newData = { ...prev };
        let current: any = newData;
        for (let i = 0; i < keys.length - 1; i++) {
          if (!(keys[i] in current)) {
            current[keys[i]] = {};
          }
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        return newData;
      });
    } else if (name === "roles") {
      setFormData((prev) => ({
        ...prev,
        roles: value as "Admin" | "Editor" | "User",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name === "username" ? "user" : name === "password" ? "pwd" : name]:
          value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validUsername || !validPassword) {
      setErrMsg("Invalid Entry");
      return;
    }
    register.mutate(formData, {
      onSuccess: () => {
        setFormData({
          user: "",
          pwd: "",
          roles: "User",
          status: "active",
          profile: {
            avatar: "",
            firstName: "",
            lastName: "",
            gender: "prefer not to say",
            birthDate: "",
            bio: "",
            location: "",
            website: "",
            socialLinks: {
              facebook: "",
              twitter: "",
              instagram: "",
              linkedin: "",
            },
          },
        });
        navigate("/sign-in");
      },
      onError: (error) => {
        if (!error.response) {
          setErrMsg("No Server Response");
        } else if (error.response.status === 409) {
          setErrMsg("Username already taken");
        } else {
          setErrMsg(error.response?.data?.message || "Registration Failed");
        }
      },
    });
  };
  return (
    <section className="register">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">
          Username: <span className={validUsername ? "valid" : "hide"}>✓</span>
          <span
            className={validUsername || !formData.user ? "hide" : "invalid"}
          >
            ✗
          </span>
        </label>
        <input
          type="text"
          id="username"
          name="user"
          value={formData.user}
          onChange={handleChange}
          autoComplete="off"
          required
        />

        <label htmlFor="password">
          Password: <span className={validPassword ? "valid" : "hide"}>✓</span>
          <span className={validPassword || !formData.pwd ? "hide" : "invalid"}>
            ✗
          </span>
        </label>
        <input
          type="password"
          id="password"
          name="pwd"
          value={formData.pwd}
          onChange={handleChange}
          required
        />

        <label htmlFor="roles">Assigned Roles:</label>
        <select
          id="roles"
          name="roles"
          value={formData.roles}
          onChange={handleChange}
        >
          <option defaultChecked value="User">
            User
          </option>
          <option value="Editor">Editor</option>
          <option value="Admin">Admin</option>
        </select>

        <label htmlFor="status">Status:</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <label htmlFor="profile.firstName">First Name:</label>
        <input
          type="text"
          id="profile.firstName"
          name="profile.firstName"
          value={formData.profile?.firstName}
          onChange={handleChange}
          required
        />

        <label htmlFor="profile.lastName">Last Name:</label>
        <input
          type="text"
          id="profile.lastName"
          name="profile.lastName"
          value={formData.profile?.lastName}
          onChange={handleChange}
        />

        <label htmlFor="profile.gender">Gender:</label>
        <select
          id="profile.gender"
          name="profile.gender"
          value={formData.profile?.gender}
          onChange={handleChange}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
          <option value="prefer not to say">Prefer not to say</option>
        </select>

        <label htmlFor="profile.birthDate">Birth Date:</label>
        <input
          type="date"
          id="profile.birthDate"
          name="profile.birthDate"
          value={formData.profile?.birthDate}
          onChange={handleChange}
        />

        <label htmlFor="profile.bio">Bio:</label>
        <textarea
          id="profile.bio"
          name="profile.bio"
          value={formData.profile?.bio}
          onChange={handleChange}
          required
        />

        <label htmlFor="profile.location">Location:</label>
        <input
          type="text"
          id="profile.location"
          name="profile.location"
          value={formData.profile?.location}
          onChange={handleChange}
        />

        <label htmlFor="profile.website">Website:</label>
        <input
          type="url"
          id="profile.website"
          name="profile.website"
          value={formData.profile?.website}
          onChange={handleChange}
        />

        <label htmlFor="profile.socialLinks.facebook">Facebook:</label>
        <input
          type="url"
          id="profile.socialLinks.facebook"
          name="profile.socialLinks.facebook"
          value={formData.profile?.socialLinks?.facebook}
          onChange={handleChange}
        />

        <label htmlFor="profile.socialLinks.twitter">Twitter:</label>
        <input
          type="url"
          id="profile.socialLinks.twitter"
          name="profile.socialLinks.twitter"
          value={formData.profile?.socialLinks?.twitter}
          onChange={handleChange}
        />

        <label htmlFor="profile.socialLinks.instagram">Instagram:</label>
        <input
          type="url"
          id="profile.socialLinks.instagram"
          name="profile.socialLinks.instagram"
          value={formData.profile?.socialLinks?.instagram}
          onChange={handleChange}
        />

        <label htmlFor="profile.socialLinks.linkedin">LinkedIn:</label>
        <input
          type="url"
          id="profile.socialLinks.linkedin"
          name="profile.socialLinks.linkedin"
          value={formData.profile?.socialLinks?.linkedin}
          onChange={handleChange}
        />

        <button type="submit" disabled={!validUsername || !validPassword}>
          Sign Up
        </button>
      </form>
      {errMsg && <p className="errmsg">{errMsg}</p>}
    </section>
  );
};

export default SignUpPage;
