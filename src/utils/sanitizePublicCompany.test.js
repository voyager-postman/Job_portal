import {
  sanitizeCompanyListApiResponse,
  sanitizeGetHomePageResponse,
  sanitizePublicCompany,
  sanitizePublicCompanyListItem,
  sanitizePublicApiResponse,
} from "./sanitizePublicCompany";

describe("sanitizePublicCompany", () => {
  it("removes private account fields from company profiles", () => {
    const input = {
      _id: "abc123",
      slug: "acme",
      brandName: "Acme Corp",
      logo: "logo.png",
      email: "secret@example.com",
      phone: { countryCode: "33", number: "123456789" },
      password: "hashed",
      registrationToken: "tok",
    };

    expect(sanitizePublicCompany(input)).toEqual({
      _id: "abc123",
      slug: "acme",
      brandName: "Acme Corp",
      logo: "logo.png",
    });
    expect(sanitizePublicCompany(input).email).toBeUndefined();
  });

  it("strips email from list items and nested companyId objects", () => {
    const item = {
      email: "rekot16889@gcervera.com",
      jobCount: 3,
      companyId: {
        _id: "c1",
        slug: "company-one",
        brandName: "Company One",
        logo: "logo.png",
        email: "rekot16889@gcervera.com",
        phone: { countryCode: "33", number: "999" },
      },
    };

    expect(sanitizePublicCompanyListItem(item)).toEqual({
      jobCount: 3,
      companyId: {
        _id: "c1",
        slug: "company-one",
        brandName: "Company One",
        logo: "logo.png",
      },
    });
  });

  it("sanitizes all public company list sections", () => {
    const response = {
      success: true,
      totalPages: 1,
      sections: {
        justJoinedUs: [
          {
            email: "private@example.com",
            companyId: {
              _id: "1",
              slug: "one",
              brandName: "One",
              email: "private@example.com",
            },
          },
        ],
        companiesOfMoment: [],
        partnerCompanies: [],
      },
    };

    const sanitized = sanitizeCompanyListApiResponse(response);

    expect(
      sanitized.sections.justJoinedUs[0].email,
    ).toBeUndefined();
    expect(
      sanitized.sections.justJoinedUs[0].companyId.email,
    ).toBeUndefined();
    expect(sanitized.sections.justJoinedUs[0].companyId.brandName).toBe("One");
  });

  it("sanitizes getHomePage payloads that include company sections", () => {
    const response = sanitizeGetHomePageResponse({
      success: true,
      data: {
        footerSection: { shortDescription: "Footer text" },
        sections: {
          justJoinedUs: [
            {
              email: "private@example.com",
              companyId: {
                _id: "1",
                slug: "one",
                brandName: "One",
                email: "private@example.com",
              },
            },
          ],
        },
      },
    });

    expect(response.data.footerSection.shortDescription).toBe("Footer text");
    expect(response.data.sections.justJoinedUs[0].email).toBeUndefined();
    expect(response.data.sections.justJoinedUs[0].companyId.email).toBeUndefined();
  });

  it("routes public API urls to the correct sanitizer", () => {
    const homeResponse = sanitizePublicApiResponse(
      "https://api.example.com/getHomePage",
      {
        data: {
          sections: {
            justJoinedUs: [{ email: "a@b.com", companyId: { _id: "1", brandName: "A" } }],
          },
        },
      },
    );

    expect(
      homeResponse.data.sections.justJoinedUs[0].email,
    ).toBeUndefined();
  });
});
