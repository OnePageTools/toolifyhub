
"use client";
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import type { ResumeData } from '@/lib/schema/resume-schema';

// Register fonts
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 'bold' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-italic-webfont.ttf', fontStyle: 'italic' },
  ],
});


type ColorTheme = {
    primary: string;
    secondary: string;
    text: string;
};

const createStyles = (theme: ColorTheme) => StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    fontFamily: 'Roboto',
    fontSize: 10,
    color: theme.text,
  },
  leftColumn: {
    width: '35%',
    backgroundColor: theme.secondary,
    padding: 20,
  },
  rightColumn: {
    width: '65%',
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.primary,
    marginBottom: 5,
  },
  title: {
    fontSize: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.primary,
    marginBottom: 10,
    borderBottom: `2px solid ${theme.primary}`,
    paddingBottom: 5,
  },
  subheading: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  text: {
    fontSize: 10,
    marginBottom: 8,
    lineHeight: 1.4,
  },
  contactItem: {
    marginBottom: 5,
  },
  skill: {
    marginBottom: 4,
  },
  listItem: {
    marginLeft: 10,
    marginBottom: 4,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    objectFit: 'cover',
  },
});

interface TemplateProps {
  data: ResumeData;
  theme: ColorTheme;
}

export const DefaultTemplate = ({ data, theme }: TemplateProps) => {
  const styles = createStyles(theme);
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.leftColumn}>
          {data.profilePicture && <Image style={styles.profileImage} src={data.profilePicture} />}
          <Text style={styles.sectionTitle}>Contact</Text>
          <Text style={styles.contactItem}>{data.email}</Text>
          <Text style={styles.contactItem}>{data.phone}</Text>
          <Text style={styles.contactItem}>{data.address}</Text>
          {data.linkedin && <Text style={styles.contactItem}>{data.linkedin}</Text>}
          {data.portfolio && <Text style={styles.contactItem}>{data.portfolio}</Text>}
          
          <View style={{ marginTop: 20 }}>
            <Text style={styles.sectionTitle}>Skills</Text>
            {data.skills?.map((skill, index) => (
              <Text key={index} style={styles.skill}>- {skill}</Text>
            ))}
          </View>

           {data.languages && data.languages.length > 0 && (
            <View style={{ marginTop: 20 }}>
              <Text style={styles.sectionTitle}>Languages</Text>
              {data.languages.map((lang, index) => (
                <Text key={index} style={styles.skill}>- {lang}</Text>
              ))}
            </View>
          )}

        </View>

        <View style={styles.rightColumn}>
          <Text style={styles.name}>{data.fullName}</Text>
          {/* A title can be derived or set as a static value for this template */}
          {data.experience[0] && <Text style={styles.title}>{data.experience[0].jobTitle}</Text>}
          
          <Text style={styles.sectionTitle}>Summary</Text>
          <Text style={styles.text}>{data.summary}</Text>
          
          <Text style={styles.sectionTitle}>Experience</Text>
          {data.experience?.map((exp, index) => (
            <View key={index} style={{ marginBottom: 15 }}>
              <Text style={styles.subheading}>{exp.jobTitle}</Text>
              <Text style={styles.text}>{exp.company} | {exp.location} | {exp.startDate} - {exp.endDate}</Text>
              {exp.responsibilities.map((resp, i) => (
                <Text key={i} style={styles.listItem}>• {resp}</Text>
              ))}
            </View>
          ))}

          <Text style={styles.sectionTitle}>Education</Text>
          {data.education?.map((edu, index) => (
            <View key={index} style={{ marginBottom: 10 }}>
              <Text style={styles.subheading}>{edu.degree}</Text>
              <Text style={styles.text}>{edu.school} | {edu.location} | {edu.gradDate}</Text>
            </View>
          ))}

          {data.projects && data.projects.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Projects</Text>
              {data.projects.map((proj, index) => (
                <View key={index} style={{ marginBottom: 10 }}>
                  <Text style={styles.subheading}>{proj.name}</Text>
                  <Text style={styles.text}>{proj.description}</Text>
                </View>
              ))}
            </>
          )}

           {data.certifications && data.certifications.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Certifications</Text>
              {data.certifications.map((cert, index) => (
                 <Text key={index} style={styles.listItem}>• {cert}</Text>
              ))}
            </>
          )}

        </View>
      </Page>
    </Document>
  )
};
